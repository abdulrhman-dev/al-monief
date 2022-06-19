import { nanoid } from "nanoid"

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

    return results.sort((a, b) => b.points - a.points)
}


