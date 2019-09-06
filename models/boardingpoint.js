var mongoose = require('mongoose')

var BoardingPoint = mongoose.model('BoardingPoint', {
    bpId: {
        type: Number,
        required: true,
    },
    bpName: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: false
    }
});

module.exports = {
    BoardingPoint: BoardingPoint
}