const hours = new Date().getHours()
export const findManyChargeLocations = [
    {
        id: 1,
        name: 'National Robotarium',
        chargeSpeed: 24.1,
        lat: '55.9124900',
        lng: '-3.3247956',
        chargePoint: [
            { chargingPointID: 1, status: 'FREE' },
            { chargingPointID: 2, status: 'BROKEN' },
            { chargingPointID: 3, status: 'FREE' },
            { chargingPointID: 4, status: 'BUSY' },
            { chargingPointID: 5, status: 'BUSY' },
            { chargingPointID: 6, status: 'PENDING' },
        ],
        queue: [],
    },
    {
        id: 2,
        name: 'Edwin Chadwick',
        chargeSpeed: 22,
        lat: '55.9117038',
        lng: '-3.3255207',
        chargePoint: [
            { chargingPointID: 7, status: 'BUSY' },
            { chargingPointID: 8, status: 'BUSY' },
        ],
        queue: [
            {
                locationID: 2,
                userID: 1,
                queueEntryTime: new Date().setHours(
                    hours - Math.floor(Math.random() * 9)
                ),
            },
            {
                locationID: 2,
                userID: 2,
                queueEntryTime: new Date().setHours(
                    hours - Math.floor(Math.random() * 9)
                ),
            },
            {
                locationID: 2,
                userID: 3,
                queueEntryTime: new Date().setHours(
                    hours - Math.floor(Math.random() * 9)
                ),
            },
        ],
    },
    {
        id: 3,
        name: 'GRID',
        chargeSpeed: 7,
        lat: '55.9114174',
        lng: '-3.3200196',
        chargePoint: [
            { chargingPointID: 8, status: 'BUSY' },
            { chargingPointID: 9, status: 'FREE' },
        ],
        queue: [],
    },
    {
        id: 4,
        name: 'Oriam',
        chargeSpeed: 24.1,
        lat: '55.9092876',
        lng: '-3.3183487',
        chargePoint: [
            { chargingPointID: 10, status: 'FREE' },
            { chargingPointID: 11, status: 'FREE' },
        ],
        queue: [],
    },
    {
        id: 5,
        name: 'Enterprise Building',
        chargeSpeed: 22,
        lat: '55.912188',
        lng: '-3.3156351',
        chargePoint: [
            { chargingPointID: 12, status: 'FREE' },
            { chargingPointID: 13, status: 'BUSY' },
        ],
        queue: [],
    },
]
