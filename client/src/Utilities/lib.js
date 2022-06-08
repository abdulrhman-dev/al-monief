export function fillEmpty(array, limit) {
    if (array.length === limit) return array;

    let emptyPart = new Array(limit - array.length).fill(null, 0)

    return [...array, ...emptyPart]
}
