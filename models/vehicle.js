var mongoose = require('mongoose')

var Vehicle = mongoose.model('Route', {
    vehicle_id: {
        type: Number,
        required : true
    },
    reg_num: {
        type: Number,
        required: true
    },
    model: {
        type: String,
        required: false
    },
    isActive : {
        type: Boolean,
        default: false
    },
    latititude: {
        type: Number,
        required: false
    },
    longitude: {
        type: Number,
        required: false
    }
})

module.exports = {
    Vehicle
}