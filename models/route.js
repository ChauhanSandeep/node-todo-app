var mongoose = require('mongoose')

var Route = mongoose.model('Route', {
    route_id: {
        type: Number
    },
    sourceId: {
        type: Number,
       required: true
    },
    destinationId: {
        type: Number,
        required: true
    },
    groupId: {
        type : Number,
        default: null
    },
    order : {
        type : Number,
        required : true
    }
})

module.exports = {
    Route
}