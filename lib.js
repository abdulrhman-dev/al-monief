function generateShortId() {
    let MAX_VALUE = 999999999;
    let MIN_VALUE = 100000000;

    return (Math.floor(Math.random() * MAX_VALUE) + MIN_VALUE).toString(36)
}

function generateAndMatch(rooms) {
    const id = generateShortId()
    const match = rooms.find(room => room.id === id)

    if (match) generateAndMatch()

    return id
}

function pointUsers(userSubmissions, correct) {
    let results = []

    userSubmissions.forEach((userSubmission, index) => {
        let words = userSubmission.words
        let user = userSubmission.user

        let points = 0;

        Object.keys(words).forEach(key => {
            let match = correct[key].find(item => item.word === words[key])

            if (match.status === "wrong") return points -= 5
            if (match.count > 1 && match.status === "right") return points += 5
            if (match.count === 1 && match.status === "right") return points += 10
        })

        if (index === 0) points = points + (points * 0.05)

        results.push({ user, points })
    })

    return results.sort((a, b) => b - a)
}

module.exports = {
    generateShortId,
    generateAndMatch,
    pointUsers
}
