// npm install mongodb@2.2.5 --save
const MongoClient = require('mongodb').MongoClient;

// In mongo we dont need to create db first and then write code
//we give the name of the database and it will be created
MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
  if(error){
    console.log(error);
    return console.log("error while connecting to mongodb server");
  }
  console.log('Connected to mongodb server');
  //console.log(db);

  // To insert the data into the mongodb
 db.collection('Todos').insertOne({
    text: 'Something to do',
    completed: false
  }, (error, result) => {
    if(error){
      return console.log("Unable to insert todo", err);
    }
    console.log(JSON.stringify(result.ops));
  });

  // insert new doc into Users collection (name, age, location)
  db.collection('Users').insertOne({
    name: 'Sandeep',
    age: 24,
    location: 'Bangalore'
  }, (error, response) => {
    if(error){
      return console.log('Unable to insert into mongo');
    }
    console.log(JSON.stringify(response.ops));
  });

  // To get all the data from mongodb
  db.collection('Todos').find().toArray().then((docs) => {
    console.log("Todos: ");
    console.log(JSON.stringify(docs, undefined, 2));
  }).catch((error) => {
    console.log("Error occured while getting data from mongo", error);
  });

// To get the data where completed is false;
 db.collection('Todos').find({completed: false}).toArray().then((docs) => {
    console.log("Todos: ");
    console.log(JSON.stringify(docs, undefined, 2));
  }).catch((error) => {
    console.log("Error occured while getting data from mongo", error);
  });

// To count the element from mongo
  db.collection('Todos').find().count().then((count) => {
    console.log(`Todos count: ${count}`);
  }).catch((error) => {
    console.log('Unable to fetch the data ', error);
  });

  //Following functions are to delete elements from mongod

  //DeleteMany
  db.collection('Todos').deleteMany({text: 'do Something'}).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.log('Could not delete element');
  })

  //DeleteOne
  db.collection('Todos').deleteOne({text: 'do Something'}).then((result) => {
    console.log(result)
  });

  // FindOneAndDelete
  db.collection('Todos').findOneAndDelete({text: 'do Something'}).then((result) => {
    console.log(result);
  });

  // deleteMany
  db.collection('Todos').deleteMany({text: 'do Something'}).then((result) => {
    console.log(result);
  });

  db.close();

});
