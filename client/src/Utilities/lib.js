export function fillEmpty(array, limit) {
    if (array.length === limit || array.length === 0) return array;

    let emptyPart = new Array(limit - array.length).fill(null, 0)

    return [...array, ...emptyPart]
}



export function generateLetters(number) {
    const ARABIC_ALPHABET = "أبتثجحخدذرزسشصضطظعغفقكلمنهوي".split("")
    let avalabileLettersArray = ARABIC_ALPHABET
    const chosenLetters = []


    for (let i = 0; i < number; i++) {
        let randomIndex = Math.floor(Math.random() * avalabileLettersArray.length)
        let letter = avalabileLettersArray[randomIndex]
        if (letter === "ه") letter = "هـ"
        chosenLetters.push(letter)
        avalabileLettersArray.splice(randomIndex, 1)
    }

    return chosenLetters
}

export function combineChecking(userWords) {

    if (!userWords) return {}

    let words = userWords.map(userWord => userWord.words)
    let baseObject = {
        "أسم": [],
        "نبات": [],
        "حيوان": [],
        "جماد": [],
        "بلاد": []
    }

    return combineObjects(words, baseObject)
}

export function combineObjects(arrayOfObjects, baseObject) {


    let obj = arrayOfObjects.reduce((mAcc, mCurr) => {
        let startingObject;

        if (!mAcc) startingObject = baseObject
        else startingObject = mAcc

        let returnObject = mCurr.reduce((acc, curr) => {
            let chunkReturnObject = {}

            Object.keys(acc).forEach(key => {
                if (!curr[key]) return chunkReturnObject[key] = [...acc[key]];
                chunkReturnObject[key] = [...acc[key], curr[key]]
            })

            return chunkReturnObject
        }, startingObject)



        return returnObject
    }, null)


    Object.keys(obj).forEach(key => {
        let array = obj[key]
        let counts = countDuplicate(array)

        array = array.map(item => (({
            word: item,
            count: counts[item]
        })))

        array = getUniqueListBy(array, "word")

        obj[key] = array
    })

    return obj
}

export function lengthOfObjectArrays(obj) {
    let lengthSum = 0

    Object.keys(obj).forEach(key => {
        lengthSum += obj[key].length
    })

    return lengthSum
}


export function countDuplicate(array) {
    let counts = {}

    array.forEach(item => {
        if (counts[item]) {
            counts[item] += 1
        } else {
            counts[item] = 1
        }
    })

    return counts
}

export function removeWordsDuplicate(array) {
    let uniqueArray = array.filter((item, index) => {
        return array.indexOf(item) === index;
    });

    return uniqueArray
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

// https://stackoverflow.com/a/56768137
export function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}


export function getFirstPlaceNumber(places) {
    const firstsArray = places.filter(place => place === 1)
    return firstsArray.length
}