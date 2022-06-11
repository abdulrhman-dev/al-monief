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
