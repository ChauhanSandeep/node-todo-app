var mongoose = require('mongoose')

var RouteAllotment = mongoose.model('RouteAllotment',{
    allotmentId :{
        type : Number,
        required : true
    },
    routeGroup :{
        type:Number,
        required :true
    },
    inventoryId :{
        type : Number,
        required :true
    },
    startTime :{
        type:Date
    },
    endTime:{
        type:Date
    },
    availableSeats:{
        type:Number,
        required:true
    }
})

module.exports = {
    RouteAllotment
}