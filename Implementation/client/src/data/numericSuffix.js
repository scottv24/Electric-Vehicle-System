export default function numericalSuffix(i) {
    const number = +i
    let lastDigit = number % 10,
        lastTwoDigits = number % 100
    if (lastDigit === 1 && lastTwoDigits !== 11) {
        return number + 'st'
    }
    if (lastDigit === 2 && lastTwoDigits !== 12) {
        return number + 'nd'
    }
    if (lastDigit === 3 && lastTwoDigits !== 13) {
        return number + 'rd'
    }
    return number + 'th'
}
