var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/RedbusShuttle');

module.exports = {
  mongoose
}
