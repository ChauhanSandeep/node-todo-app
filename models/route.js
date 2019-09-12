var mongoose = require('mongoose')

var Route = mongoose.model('Route', {
    route_id: {
        type: Number
    },
    sourceId: {
        type: Number,
       required: 1
    },
    destinationId: {
        type: Number,
        required: 2
    },
    groupId: {
        type : Number,
        default: null
    },
    order : {
        type : Number,
        required : 3
    }
})

module.exports = {
    Route
}