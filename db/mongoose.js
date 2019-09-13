var mongoose = require('mongoose');

mongoose.connect('mongodb://10.120.19.235:27017/RedbusShuttle');
//mongoose.openUri('mongodb://localhost:27017/RedbusShuttle');

module.exports = {
  mongoose
}
