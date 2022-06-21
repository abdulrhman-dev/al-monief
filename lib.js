import { nanoid } from "nanoid"
import LeaderboardUser from "./models/LeaderboardUser.js";


export function generateAndMatch(rooms) {
    const id = nanoid(6)
    const match = rooms.find(room => room.id === id)

    if (match) generateAndMatch()

    return id
}

export async function pointUsers(userSubmissions, correct) {
    let results = []

    userSubmissions.forEach((userSubmission, index) => {
        let words = userSubmission.words
        let user = userSubmission.user

        let points = 0;

        words.forEach(word => {
            Object.keys(word).forEach(key => {
                let match = correct[key].find(item => item.word === word[key])

                if (match.status === "wrong") return points -= 5
                if (match.count > 1 && match.status === "right") return points += 5
                if (match.count === 1 && match.status === "right") return points += 10
            })
        })


        if (index === 0) points = points + (points * 0.05)

        results.push({ user, points })
    })

    results = results.sort((a, b) => b.points - a.points)
    await storeLeaderboards(results)

    return results
}


export async function storeLeaderboards(array) {
    try {
        array.forEach(async (data, index) => {
            let user = await LeaderboardUser.findOne({ generalId: data.user.generalId })
            if (!user) {
                console.log({
                    ...data.user,
                    points: data.points,
                    gamePlaces: [index + 1],
                    numberOfGames: 1
                })
                return LeaderboardUser.create({
                    ...data.user,
                    points: data.points,
                    gamePlaces: [index + 1],
                    numberOfGames: 1
                })
            }

            user.gamePlaces = [...user.gamePlaces, index + 1],
                user.numberOfGames = user.numberOfGames + 1,
                user.points = user.points + data.points

            await user.save()
        })
    } catch (error) {
        console.log(error.message)
    }

};

export async function getLeaderboardsSorted() {
    let users = await LeaderboardUser.find({})
    let usersArray = Object.keys(users).map(key => users[key])
    return usersArray.sort((a, b) => b.points - a.points);
}
