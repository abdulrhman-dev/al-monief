import { nanoid } from "nanoid"
import Database from "@molo_7/db.json"

const db = new Database("./db/leaderboards.json");

export function generateAndMatch(rooms) {
    const id = nanoid(6)
    const match = rooms.find(room => room.id === id)

    if (match) generateAndMatch()

    return id
}

export function pointUsers(userSubmissions, correct) {
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
    storeLeaderboards(results)

    return results
}


export function storeLeaderboards(array) {
    array.forEach((data, index) => {
        let user = db.get(data.user.generalId)

        if (user === null) {
            return db.set(data.user.generalId, {
                ...data.user,
                points: data.points,
                gamePlaces: [index + 1],
                numberOfGames: 1
            })
        }

        db.set(data.user.generalId, {
            ...data.user,
            gamePlaces: [...user.gamePlaces, index + 1],
            numberOfGames: user.numberOfGames + 1,
            points: user.points + data.points
        })

    })
};

export function getLeaderboardsSorted() {
    let users = db.fetchAll()
    let usersArray = Object.keys(users).map(key => users[key])
    return usersArray.sort((a, b) => b.points - a.points);
}
