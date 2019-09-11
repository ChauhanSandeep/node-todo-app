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
    },
    latitude:{
        type: Number,
        required : true  
    },
    longitude: {
        type: Number,
        required: true
    },
    isHub: {
        type : Boolean,
        default : false
    }
 
});

module.exports = {
    BoardingPoint: BoardingPoint
}