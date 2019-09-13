var express = require('express');
var bodyParser = require('body-parser');
var haversine = require('haversine-distance');

// this is to validate the id in mongo and fetch the data accordingly.
var {ObjectId} = require('mongodb');

var {BoardingPoint} = require('./models/boardingpoint');
var {Route} = require('./models/route');
var {mongoose} = require('./db/mongoose');

var app = express();

app.use(bodyParser.json());

// add new boarding point
app.post('/boardingPoint', (req, res) => {
  console.log("Got post request for " + res);
  var boardingPoint = new BoardingPoint({
    bpId: req.body.bpId,
    bpName: req.body.bpName,
      isActive: req.body.isActive,
      latitude:req.body.latitude,
      longitude: req.body.longitude,
      isHub: req.body.isHub


  })

  boardingPoint.save()
      .then((doc) => {
        res.send(doc);
      }, (error) => {
        res.status(400).send(error);
      });
});


// for <currrentlocation, List<bp>> find the <bp, eta>
// Request:
// {"lattitude":102,"longitude":2,"boardingPoints":[bp1, bp2]}
// Response:
// {"list":[{"bp":bp1,"eta":12},{"bp":bp1,"eta":15}]}

app.post('/findBpEta', (req, res) => {
    console.log("got post request to find ETA for nearby boarding points");
    var lattitude = req.body.lattitude;
    var longitude = req.body.longitude;
    var boardingPoints = req.body.boardingPoints;

    let array = new Array();

    for(let i = 0; i < boardingPoints.length; i++){
        let eta = findEta(lattitude, longitude, boardingPoints[i]);
        array.push({"bp" : boardingPoints[i], "eta" : eta});
    }
    return res.send({"list" : [...array]});;

})

function findEta(lattitude, longitude, boardingPoint) {
    let distance = getDistanceBetweenPointsInMeters(lattitude, longitude, boardingPoint.latitude, boardingPoint.longitude);
    return Math.trunc(distance/80); // returns time in minutes
}

// add new route
app.post('/route', (req, res) => {
  console.log("Got post request for " + res);
  console.log(req.body.route_id,req.body.sourceId,req.body.destinationId,req.body.groupId,req.body.order)
  var route = new Route({
    route_id: req.body.route_id,
    sourceId : req.body.sourceId,
    destinationId : req.body.destinationId,
    groupId : req.body.groupId,
    order : req.body.order,
    fare : req.body.fare
  })

  route.save()
      .then((doc) => {
        res.send(doc);
      }, (error) => {
        console.log(error)
        res.send(400).send(error);
      });
});

app.get('/test', (req, res) => {
    console.log("get bp got given id");
    let bpId = 5
    let dpId = 6

    let srcSet = new Set()
    let destSet = new Set()
    let finalSet = new Set()


    // find all groupId where sourceId=bpId
    let promise1 =
        Route.find({sourceId: bpId})
            .then(async(a) => {
                for (let i = 0; i < routes.length; i++) {
                   await srcSet.add(routes[i].groupId)
                }
            })


            /*.then( async () => {

            Route.find({destinationId: dpId})
                .then(async (srcSet) => {
                    for (let i = 0; i < routes.length; i++) {
                        await destSet.add(routes[i].groupId)
                    }
                }).then( async () => {

                console.log(srcSet);
                console.log(destSet);

                for(let i=0;i<srcSet.length;i++) {
                    if (destSet.contains(srcSet[i])) {
                        finalSet.add(srcSet[i])
                    }
                }
            })

        });




    // find all routes with above groupId , search dest:dpId



     /*   for (let i = 0; i < grpSet.length; i++) {
            let routes = Route.find({$and: [{destinationId: dpId}, {groupId: grpSet[i]}]})
                .then((routes) => {
                    for (let i = 0; i < routes.length; i++) {
                        finalSet.add(routes[i].groupId)
                    }
                });
        } */
        res.send(srcSet)


});


app.get('/bpforgivenid', (req, res) => {
console.log("get bp got given id");
    let routes = Route.find({sourceId:bpID})
        .then((routes) => {
            console.log(routes);
        })
    let x =0;

let temp=Route.find({})

let id=req.query.id
BoardingPoint.find().then((bps) => {
for(let i=0;i<bps.length ; i++){
if(bps[i].bpId == id){
res.send(bps[i])
break;
}
}
}, (error) => {
console.log("error occured while fetching boarding point for given id");
res.status(400).send(error);
});
});

// get all the routes
app.get('/routes', (req, res) => {
  console.log("all the routes");
  Route.find().then((routes) => {
    console.log(JSON.stringify(routes))
    res.send({routes})
  }, (error) => {
    console.log("error occured while fetching all the routes");
    res.status(400).send(error);
  });
});

// get all the boarding points
app.get('/boardingpoints', (req, res) => {
  console.log("fetch all the boarding points");
  BoardingPoint.find().then((bps) => {
    console.log(JSON.stringify(bps));
    res.send(bps)
  }, (error) => {
    console.log("error occured in fetching boarding points" + error);
    res.status(400).send(error);
  })
});
//will return bps within distance of 500 meters
app.post('/nearestBP',(req,res)=>{
    var lat1 =req.body.latitude
    var lon1 =req.body.longitude
    var bpArray =new Array();
    BoardingPoint.find().stream()
        .on('data', function(doc){
            console.log(doc)
            var distance=getDistanceBetweenPointsInMeters(lat1,lon1,doc.latitude,doc.longitude)
            if (500>=distance) {
                bpArray.push(doc)
            }

        })
        .on('error', function(err){
            console.log(err)
        })
        .on('end', function(){
            // final callback
            res.send(bpArray)
        });

  // Promise.all([promise1]).then(result=>{
  //
  // });

});

app.post('/dropingpointsarray',(req,res)=>{
    var lat1 =req.body.latitude
    var lon1 =req.body.longitude
    var bpArray =new Array();
    var respMap = new Map();

    let pormise = BoardingPoint.find().stream()
        .on('data', function(doc){
        //    console.log(doc)
            var distance=getDistanceBetweenPointsInMeters(lat1,lon1,doc.latitude,doc.longitude)
            console.log("distance from user locaton is"+distance+"for bpName:"+doc.bpName)
            if (500>=distance) {
                bpArray.push(doc)
                //console.log(doc)
                console.log(bpArray)
            }

        })
        .on('error', function(err){
            console.log(err)
        })
        .on('end', function(){
            // final callback
            if(bpArray.length>0){
                //1.Getting the groupids of the bps.
                //2.Form groupids getting the destinations..
                for(i=0;i<bpArray.length;i++){
                    var bp=bpArray[i]
                    var destIdArray =new Array();
                    var groupIDArray =new Array();
                    var destinations =new Array();
                    var order
                    Route.find({sourceId:bp.bpId}).then((routes)=>{
                        console.log("inside findBySourceId then...")
                        console.log("Routes:" + routes)
                        for(i=0;i<routes.length;i++) {
                            var route=routes[i];
                            order=route.order
                            groupIDArray.push(route.groupId);
                        }

                    }).then(()=>{
                        console.log("Inside groupidarray then..")
                        for(i=0;i<groupIDArray.length;i++){
                            var groupId =groupIDArray[i];
                            Route.find({groupId:groupId}).then((routes)=>{
                                for(i=0;i<routes.length;i++) {
                                    var route=routes[i];

                                    if(bp.bpId==route.destinationId ||order<route.order){
                                        continue;
                                    }

                                    destIdArray.push(route.destinationId)
                                }
                            }).then(()=>{
                                res.send(destIdArray)
                            })
                        }

                    });


                    // .then(()=>{
                    //     for(i=0;i<destIdArray.length;i++){
                    //         var destId=destIdArray[i]
                    //         BoardingPoint.find({bpId:destId}).then((doc)=>{
                    //             destinations.push(doc)
                    //         })
                    //     }
                    // }).then(()=>{
                    //     respMap.set(bp.bpId,destinations)
                    // })


                }



            }
        });






    // let task = new Promise((resolve, reject) => {
    //     let i=0;
    //     for(i=0;i<destIdArray.length;i++){
    //         var destId=destIdArray[i]
    //         BoardingPoint.find({bpId:destId}).then((doc)=>{
    //             destinations.push(doc)
    //         })
    //     }
    //     while(i < destIdArray.length){
    //
    //     }
    //     resolve("resolve")
    //     // reject("reject")
    // });
    //
    // let promise2 = task();
    //
    // Promise.all([promise1, promise2]).then(result => {
    //     respMap.set(bp.bpId,destinations);
    // })

    //res.send(respMap)
});

app.post('/dropingpoint',(req,res)=>{
   var destIdArray =req.body.destIdArray
    for(i=0;i<destIdArray.length;i++){
                var destId=destIdArray[i]
                BoardingPoint.find({bpId:destId}).then((doc)=>{
                    destinations.push(doc)
                })
            }
})






// get all the routes for source and destination
app.get('/getroutes/:source/:destination', (req, res) => {
  console.log("fetching all the routes for the source and destination");
  //todo: considering happy flow for now, validate the data

    let sourceName = req.params.source
    let destinationName = req.params.destination;
    let sourceId = -1;
    let destinationId = -1;

  console.log("source name " + sourceName);
  console.log("destination name " + destinationName);

  let promise1 = BoardingPoint.findOne({bpName: sourceName})
      .then((data) => {
        sourceId = data.bpId;
      }, (error) => {
        console.log(error);
      });
  let promise2 = BoardingPoint.findOne({bpName: destinationName})
      .then((data) => {
          destinationId = data.bpId;
      }, (error) => {
      });

  Promise.all([promise1, promise2]).then(results => {
      console.log(sourceId + "    " + destinationId);
      Route.find({from: sourceId, to: destinationId})
          .then((routes) => {
              res.send({routes});
          }, (error) => {
              console.log("error while fetching route for source : "+ sourceId + " destination: " + destinationId);
              res.status(400).send(error);
          });
  });

});

app.listen(3000, () => {
  console.log('webapp started on port 3000');
});

module.exports = {
  app
}
function getDistanceBetweenPointsInMeters(lat1,lon1,lat2,lon2) {

    var a = { "latitude": lat1, "longitude" : lon1 }
    var b = { "latitude":lat2, "longitude":lon2 }

    return haversine(a,b)
    console.log(haversine(a, b))

}

function getUniqueGroups(bpId,dpId){
   // console.log(Route.find({bpID:bpID, dpID : dpID}))
    // let temp=Route.find({})


}

function allocateVehicle(bpId,dpId,seats){

    // 1 )get all the unique groupId from Routs table from given bp to dp,
    // 2) get all the vehicles(inventory) running on above groupId from inventory_route_allotment table with available seats >= seats
    // 3) get current location of all above vehicle
    // check get first vehicle

}
