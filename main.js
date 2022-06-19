import "dotenv/config"

import express from "express"
import { createServer } from "http"
import { Server } from "socket.io";
import { generateAndMatch, pointUsers } from "./lib.js"

const app = express()

const httpServer = createServer()


const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_ORIGIN
    }
})

let rooms = []
const USER_LIMIT = 4

app.get("/", (req, res) => {
    console.log("TEST")
    res.send(`socket.io started on PORT: ${process.env.PORT}`)
})

app.get("/room/:id", (req, res) => {
    const { id } = req.params

    res.redirect(`moneif://game/room/${id}`);
})


io.on("connection", socket => {
    console.log(`${socket.id} connected...`)

    socket.on("configure-user", (user, callback) => {
        if (socket.user) {
            callback(socket.user)
            return
        }

        socket.user = {
            ...user,
            id: socket.id
        }

        callback(socket.user)
        console.log(`------------->Saved ${user.name} for socket: ${socket.id}.`)
    })

    socket.use(([event], next) => {
        if (event === "configure-user") return next()

        if (!socket.user) {
            return socket.emit("give-user", () => {
                next()
            })
        }

        next()
    })

    socket.on("generate-room", callback => {
        const id = generateAndMatch(rooms)

        socket.join(id)

        let roomData = {
            id,
            users: [socket.user],
            leader: socket.user,
            game: {},
            userWords: []
        }

        rooms.push(roomData)



        callback(roomData)
    })

    socket.on("play-again", async (id, callback) => {
        const match = rooms.findIndex(room => room.id === id)

        let roomData = {
            id,
            users: [socket.user],
            leader: socket.user,
            game: {},
            userWords: []
        }


        if (match !== -1) {
            rooms.splice(match, 1);
        }

        const sockets = await socket.in(id).fetchSockets()
        const users = sockets.map(socket => socket.user)

        roomData.users = [socket.user, ...users]


        rooms.push(roomData)

        socket.broadcast.to(id).emit("join-play-again", roomData)

        callback(roomData)
    })

    socket.on("join-room", async (id, callback) => {
        const match = rooms.findIndex(room => room.id === id)
        if (match === -1) return callback({ msg: "Room doesn't exist" }, null)

        const sockets = await socket.in(id).fetchSockets()
        const users = sockets.map(socket => socket.user)

        if (match.started) return callback({ msg: "Game has already started" }, null)

        if (users.length >= USER_LIMIT) return callback({ msg: "Room is full" }, null)



        rooms[match] = {
            ...rooms[match],
            users: [...rooms[match].users, socket.user]
        }

        socket.join(id)


        callback(null, rooms[match])

        socket.broadcast.to(id).emit("user-joined", socket.user)
    })

    socket.on("start-game", ({ roomId, game }, callback) => {
        const match = rooms.findIndex(room => room.id === roomId)

        rooms[match] = {
            ...rooms[match],
            started: true,
            game
        }

        socket.broadcast.to(roomId).emit("emit-start-game", game)

        callback()
    })

    socket.on("submit-game", ({ roomId, roundWords }, callback) => {
        const match = rooms.findIndex(room => room.id === roomId)

        rooms[match] = {
            ...rooms[match],
            userWords: [...rooms[match].userWords, { words: roundWords, user: socket.user }]
        }

        if (!rooms[match].game.isCountdown) {
            rooms[match].game.isCountdown = true
            socket.broadcast.to(roomId).emit("start-countdown")
        }


        if (rooms[match].userWords.length === rooms[match].users.length) {
            rooms[match].game.submited = true
            io.to(rooms[match].leader.id).emit("leaderboard-submit", rooms[match].userWords);
        }

        callback()
    })

    socket.on("submit-results", ({ userWords, results: checkingResults, roomId }, callback) => {
        try {
            let results = pointUsers(userWords, checkingResults)

            callback(results, null)

            socket.broadcast.to(roomId).emit("show-results", results)
        } catch (err) {
            console.log(err)
            callback([], true)
        }


    })

    socket.on("leave-room", (id, callback) => {
        socket.leave(id)
        if (callback) callback()
    })
})

io.of("/").adapter.on("delete-room", roomId => {
    console.log(`Deleted Room: ${roomId}`)
    rooms = rooms.filter(room => room.id !== roomId)
});

io.of("/").adapter.on("leave-room", (roomId, socketId) => {
    const match = rooms.findIndex(room => room.id === roomId)

    if (match === -1) return;

    // if the user that is leaving is the last user
    if (rooms[match].users.length === 1) return rooms.splice(match, 1);

    if (rooms[match].game.submited === true && rooms[match].leader.id === socketId) {
        let filterdUsers = rooms[match].users.filter(roomUser => roomUser.id !== socketId)
        let newLeader = rooms[match].users[1]

        rooms[match] = {
            ...rooms[match],
            leader: newLeader,
            users: filterdUsers
        }

        return io.sockets.to(newLeader.id).emit("transfer-results", { room: rooms[match], userWords: rooms[match].userWords })
    }

    // preventing the deletion of the room if the countdown is started

    if (rooms[match].game.isCountdown && rooms[match].leader.id !== socketId) {
        const matchUserSubmited = rooms[match].userWords.findIndex(userSubmission => userSubmission.user.id === socketId)

        if (matchUserSubmited !== -1) {
            return;
        }

        if (rooms[match].users.length - 1 === 1) {
            rooms[match].game.submited = true
            io.to(rooms[match].leader.id).emit("leaderboard-submit", rooms[match].userWords);
        }
    }

    // if there will only be one user while game has strted
    if (rooms[match].users.length - 1 === 1 && rooms[match].started && !rooms[match].game.isCountdown) {
        io.sockets.to(roomId).emit("game-ended", {})
        return rooms.splice(match, 1);
    }

    let filterdUsers = rooms[match].users.filter(roomUser => roomUser.id !== socketId)

    if (rooms[match].leader.id !== socketId) {
        rooms[match] = {
            ...rooms[match],
            users: filterdUsers
        }

        return io.sockets.to(roomId).emit("user-left", { roomData: rooms[match] })
    }

    console.log(`Transferd leader from to ${rooms[match].users[1].name}`)
    // if the user that is leaving is the leader
    rooms[match] = {
        ...rooms[match],
        leader: rooms[match].users[1],
        users: filterdUsers
    }

    io.sockets.to(roomId).emit("user-left", { roomData: rooms[match] })

    console.log(`${socketId} left room: ${roomId}`)
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

app.listen(1234)