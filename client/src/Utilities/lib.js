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

export function combineChecking(userWords, uniqueOutput) {
    if (!userWords) return {}

    let wordsObjects = userWords.map(userWord => userWord.words)
    let baseObject = {
        "أسم": "",
        "نبات": "",
        "حيوان": "",
        "جماد": "",
        "بلاد": ""
    }

    return combineObjects(wordsObjects, baseObject, uniqueOutput)
}

export function combineObjects(arrayOfObjects, baseObject, uniqueOutput) {
    let resultObject = {}

    Object.keys(baseObject).forEach(key => {
        let keysArray = []

        arrayOfObjects.forEach(obj => {
            let word = obj[key]
            if (word) keysArray.push(word)
        })


        let counts = countDuplicate(keysArray)

        if (uniqueOutput) keysArray = removeWordsDuplicate(keysArray)

        keysArray = keysArray.map(word => {


            return { word, count: counts[word] }
        })



        resultObject = {
            ...resultObject,
            [key]: keysArray
        }
    })

    return resultObject
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
    console.log(array)
    let uniqueArray = array.filter((item, index) => {
        return array.indexOf(item) === index;
    });

    return uniqueArray
}
