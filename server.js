var express = require('express');
var bodyParser = require('body-parser');
// this is to validate the id in mongo and fetch the data accordingly.
var {ObjectId} = require('mongodb');

var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {mongoose} = require('./db/mongoose');

var app = express();

app.use(bodyParser.json());

// API to get all the TODOs
app.get('/todos', (req, res) => {
  console.log('got the todo get request');
  Todo.find().then((todos) => {
    res.send({todos});
  }, (error) => {
    console.log('Error occured while getting the todos');
    res.status(400).send(e);
  });
});

//API to get one TODO item
app.get('/todos/:id', (req, res) => {
  //to fetch the id parameter from GET url
  var id = req.params.id;
  //validate the id using isValid
  if(!ObjectId.isValid(id)){
    console.log('The id is not valid');
    return res.status(404).send();
  }
  // query the db with id
  Todo.findById(id).then((todo) => {
    console.log('got the todo successfully');
    if(!todo){
      console.log('The value inside todo is null');
      return res.status(404).send();
    }
    console.log('found the valid todo');
    return res.send({todo});
  }, (error) => {
    res.status(400).send();
  });

})

// API to post a TODO
app.post('/todos', (req, res) => {
  console.log('Got the post request for : ' + req);

  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (error) => {
    res.status(400).send(error);
  });


});


app.listen(3000, () => {
  console.log('webapp started on port 3000');
});

module.exports = {
  app
}
