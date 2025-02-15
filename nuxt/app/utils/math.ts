export function randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/** Get lowest value from data set array */
export function getLowest(array: number[]): number {
    return Math.min(...array)
}

/** Get highest value from data set array */
export function getHighest(array: number[]): number {
    return Math.max(...array)
}

/** Get value range from data set array */
export function getRange(array: number[]): number {
    return getHighest(array) - getLowest(array)
}

/**
 * Gets the index of the element in an array that corresponds to the given percentile
 * @param {number} arrLength the length of the array that we want to calculate its percentile
 * @param {number} p the percentile in the range [0..100] inclusive
 * @returns index of the array element that corresponds to the given percentile
 */
export function getPercentileIndex(array: number[], p: number): number {
    return Math.ceil((array.length - 1) * p / 100)
}

export function modeSort(x, y) {
    if (x > y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
}

/**
 * @returns the value at the nth location in the array where n is between 0 to array.length
 */
export function getPercentile(array: number[], p: number): number {
    return array[getPercentileIndex(array, p)]
}

/** Return mean/average value from a data set array */
export function getMean(array: number[]): number {
    return array.reduce((sum, currentValue) => sum + currentValue, 0) / array.length
}

/** Returns median value from a data set array */
export function getMedian(values: number[]): number {

    if (values.length === 0) {
        throw new Error('Input array is empty')
    }

    // Sorting values, preventing original array
    // from being mutated.
    values = [...values].sort((a, b) => a - b)

    const half = Math.floor(values.length / 2)

    return (values.length % 2
    ? values[half]
    : (values[half - 1] + values[half]) / 2
    )
}


/** Count number of occurences of each number */
export function useSortByMode(array: number[], type: 'asc' | 'desc' = 'desc', reduce: boolean = false): number[] {
    let obj = {}
    type = !type ? 'desc' : type

    /**
     * For each number in array,
     * if it doesn't already exist as a key on the object,
     * create one and set its value to 1. If it already exists,
     * we increment its corresponding value.
     */

    array = [...array]

    array.forEach(number => {
        if(!obj[number]) {
            obj[number] = 1
        } else {
            obj[number] += 1
        }
    })

    let sortedObject = Object.entries(obj).sort(([, a], [, b]) => type == 'asc' ? a - b : b - a)

    let returnArray = []
    for (let x in sortedObject) {
        /** We do not want to reduce the array of it`s original values, only to sort */
        if (!reduce) {
            for (let index = 0; index < Number(sortedObject[x][1]); index++) {
                returnArray.push(Number(sortedObject[x][0]))
            }
        } else {
            returnArray.push(Number(sortedObject[x][0]))
        }

    }

    return returnArray
}

/** Count number of occurences of each number */
export function getMode(array: number[]): number {
    let obj = {}
    let highestValue = 0
    let highestValueKey = -Infinity

    /**
     * For each number in array,
     * if it doesn't already exist as a key on the object,
     * create one and set its value to 1. If it already exists,
     * we increment its corresponding value.
     */
    array.forEach(number => {
        if(!obj[number]) {
            obj[number] = 1
        } else {
            obj[number] += 1
        }
    })

    for (let key in obj) {
        const value = obj[key]

        if(value >= highestValue && Number(key) > highestValueKey) {
            highestValue    = value
            highestValueKey = Number(key)
        }
    }


    return highestValueKey
}
