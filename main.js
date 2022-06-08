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

io.on("connection", socket => {
    console.log(`${socket.id} connected...`)

    socket.on("configure-user", user => {
        socket.user = user
        console.log(`Saved user for socket: ${socket.id}.`)
    })

    socket.on("generate-room", callback => {
        const id = generateAndMatch()

        socket.join(id)

        callback(id)
    })

    socket.on("leave-room", id => {
        socket.leave(id)
    })
})

function generateAndMatch() {
    const id = generateShortId()
    const match = rooms.find(roomId => roomId === id)

    if (match) generateAndMatch()

    rooms.push(id)

    return id
}

// from socket.io docs

io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
});

io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
});

io.of("/").adapter.on("leave-room", (room, id) => {
    console.log(`socket ${id} has left room ${room}`);
});

httpServer.listen(process.env.PORT || 8000, () => {
    console.log("Server is running...")
})