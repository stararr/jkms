export function getDate(Timestamp) {
    return new Date(Timestamp.seconds*(10**3) + Timestamp.nanoseconds/(10**6))
}