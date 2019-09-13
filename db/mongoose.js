var mongoose = require('mongoose');

mongoose.connect('mongodb://10.120.19.235:27017/RedbusShuttle');

// http://10.120.19.235:3000/routes
//mongoose.openUri('mongodb://localhost:27017/RedbusShuttle');

module.exports = {
  mongoose
}
