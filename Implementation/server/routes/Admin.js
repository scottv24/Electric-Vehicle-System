const express = require('express')
const router = express.Router()

router.get('/get-data', (req, res) => {
    const chargers = ['list', 'of', 'admins']
    res.json({ chargers })
})

module.exports = router
