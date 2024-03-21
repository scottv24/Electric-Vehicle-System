function getAvailability(chargingPoints) {
    const available = chargingPoints.filter(
        (charger) => charger.status === 'IDLE',
    ).length
    const broken = chargingPoints.filter(
        (charger) => charger.status === 'BROKEN',
    ).length
    const charging = chargingPoints.filter(
        (charger) => charger.status === 'CHARGING',
    ).length
    const reserved = chargingPoints.filter(
        (charger) => charger.status === 'BROKEN',
    ).length
    const numChargers = chargingPoints.length
    const availability = { numChargers, available, broken, charging, reserved }
    return availability
}

module.exports = getAvailability
