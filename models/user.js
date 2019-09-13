var mongoose  = require('mongoose');

var User = mongoose.model('User', {
  user_id: {
    type: Number,
    required: true,
  },
  name: {
    type : String,
    required : true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  isDriver : {
    type : Boolean,
    default : false
  },
  owned_vehicle_id : {
    type : Number,
    required : false
  }

});

module.exports = {
  User
}
