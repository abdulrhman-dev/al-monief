require("dotenv").config()

const app = require("express")()
const httpServer = require("http").createServer(app)
const { generateShortId } = require("./lib")


const io = require("socket.io")(httpServer, {
    cors: {
        origin: process.env.CLIENT_ORIGIN
    }
})

let rooms = []
const USER_LIMIT = 4

io.on("connection", socket => {
    console.log(`${socket.id} connected...`)

    socket.on("configure-user", user => {
        if (socket.user) return

        socket.user = {
            ...user,
            id: socket.id
        }
        console.log(`------------->Saved ${user.name} for socket: ${socket.id}.`)
    })

    socket.on("generate-room", callback => {
        const id = generateAndMatch()

        socket.join(id)

        rooms.push(id)

        callback(id)
    })

    socket.on("join-room", async (id, callback) => {
        const match = rooms.find(roomId => roomId === id)
        if (!match) return callback({ msg: "Room doesn't exist" }, null)

        const sockets = await socket.in(id).fetchSockets()
        const users = sockets.map(socket => socket.user)

        if (users.length >= USER_LIMIT) return callback({ msg: "Room is full" }, null)


        socket.join(id)
        io.sockets.to(id).emit("user-joined", socket.user)
        callback(null, {
            id,
            users: [...users, socket.user]
        })
    })

    socket.on("leave-room", id => {
        socket.leave(id)
    })
})

function generateAndMatch() {
    const id = generateShortId()
    const match = rooms.find(roomId => roomId === id)

    if (match) generateAndMatch()

    return id
}


io.of("/").adapter.on("delete-room", roomId => {
    console.log(`Deleted Room: ${roomId}`)
    rooms = rooms.filter(id => id !== roomId)
});

io.of("/").adapter.on("leave-room", (room, socketId) => {
    // TODO: Change leader if the leader left the room
    io.sockets.to(room).emit("user-left", socketId)
    console.log(`${socketId} left room: ${room}`)
})

io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
});

io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
});



httpServer.listen(process.env.PORT || 8000, () => {
    console.log("Server is running...")
})