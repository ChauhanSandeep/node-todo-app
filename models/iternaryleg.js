var mongoose = require('mongoose')

var IternaryLeg = mongoose.model('IternaryLeg',{
    iternaryId:{
        type : Number,
        required : true
    },
    userId :{
        type: Number,
        required: true
    },
    bookedSeat:{
        type:Number,
        required:true
    },
    inventoryRouteId:{
        type : Number,
        required:true
    },
    bpName:{
        type: String
    },
    dpName:{
        type : String
    },
    bpId:{
        type:Number
    },
    dpId:{
        type: Number
    }
})