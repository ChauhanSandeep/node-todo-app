var mongoose = require('mongoose')

var PathSimulation = mongoose.model('PathSimulation',{
    lat :{
        type : Number,
        required : true
    },
    lon :{
        type:Number,
        required :true
    }
})

module.exports = {
    PathSimulation
}