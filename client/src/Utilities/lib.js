export function fillEmpty(array, limit) {
    if (array.length === limit || array.length === 0) return array;

    let emptyPart = new Array(limit - array.length).fill(null, 0)

    return [...array, ...emptyPart]
}


let ARABIC_ALPHABET = "أبتثجحخدذرزسشصضطظعغفقكلمنهوي".split("")

export function generateLetters(number) {
    let avalabileLettersArray = ARABIC_ALPHABET
    let chosenLetters = []

    for (let i = 0; i < number; i++) {
        let randomIndex = Math.floor(Math.random() * avalabileLettersArray.length)
        chosenLetters.push(avalabileLettersArray[randomIndex])
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
                console.log(curr[key], "KEY")
                if (!curr[key]) return chunkReturnObject[key] = [...acc[key]];
                chunkReturnObject[key] = [...acc[key], curr[key]]
            })

            return chunkReturnObject
        }, startingObject)



        return returnObject
    }, null)


    Object.keys(obj).forEach(key => {
        let array = obj[key]
        let uniqueArray = removeWordsDuplicate(array)

        let counts = countDuplicate(array)

        obj[key] = uniqueArray.map(item => {
            console.log(item, "ITEM")

            return (({
                word: item,
                count: counts[item]
            }))
        })
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
