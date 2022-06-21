import mongoose from "mongoose"


const LeaderboardUserSchema = mongoose.Schema({
    name: String,
    avatarSeed: String,
    generalId: String,
    points: Number,
    numberOfGames: {
        type: Number,
        default: 1
    },
    gamePlaces: {
        type: [Number],
        default: []
    }
})

const LeaderboardUserModal = mongoose.model("LeaderboardUser", LeaderboardUserSchema)

export default LeaderboardUserModal