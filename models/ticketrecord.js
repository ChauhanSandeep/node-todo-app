var mongoose = require('mongoose')

var TicketRecord = mongoose.model('TicketRecord', {
    ticket_id: {
        type: Number,
        default: 1
    },
    passenger_id: {
        type: Number,
        required: true
    },
    vehicle_id: {
        type: Number,
        required: true
    },
    source_id: {
        type : Number,
        default: null
    },
    destination_id : {
        type : Number,
        required : true
    },
    fare : {
        type : Number,
        required : true,
        default: 0
    },
    status: {
        type: String,
        required: true,
        default: "BOOKED"
    },
    block_key: {
        type: String,
        required: true
    }
})

module.exports = {
    TicketRecord
}
