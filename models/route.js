var mongoose = require('mongoose')

var Route = mongoose.model('Route', {
    route_id: {
        type: Number,
        required: true
    },
    from: {
        type: Number,
        required: true,
    },
    to: {
        type: Number,
        required: true,
    },
    parent: {
        type : Number,
        default: null
    }
})

module.exports = {
    Route
}