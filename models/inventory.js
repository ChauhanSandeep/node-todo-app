var mongoose = require('mongoose')

var Inventory = mongoose.model('Inventory',{
    inventoryID : {
        type : Number,
        required : true
    },
    inventoryType :{
        type : String   
    },
    regNo :{
        type : String,
        required : true
    },
    seats :{
        type : Number,
        default : 1,
        required : true 
    },
    active : {
        type : Boolean,
        default : true
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
    Inventory
}