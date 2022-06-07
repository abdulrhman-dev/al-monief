require("dotenv").config()

const app = require("express")()
const httpServer = require("http").createServer(app)


const io = require("socket.io")(httpServer, {
    cors: {
        origin: process.env.CLIENT_ORIGIN
    }
})

io.on("connection", socket => {
    console.log(`${socket.id} connected...`)

    socket.on("configure-user", user => {
        socket.user = user
        console.log(`Saved user for socket: ${socket.id}.`)
    })
})


httpServer.listen(process.env.PORT || 8000, () => {
    console.log("Server is running...")
})