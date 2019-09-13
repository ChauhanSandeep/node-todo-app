var express = require('express');
var bodyParser = require('body-parser');
var haversine = require('haversine-distance');

// this is to validate the id in mongo and fetch the data accordingly.
var {ObjectId} = require('mongodb');
var {PathSimulation} = require('./models/pathsimulation');
var {BoardingPoint} = require('./models/boardingpoint');
var {Route} = require('./models/route');
var {RouteAllotment} = require('./models/inventory_route_allotment');
var {User} = require('./models/user');
var {Inventory} = require('./models/inventory');
var {TicketRecord} = require('./models/ticketrecord');
var {mongoose} = require('./db/mongoose');

var{RouteAllotment} =require ('./models/inventory_route_allotment');

var{Inventory} =require ('./models/inventory.js');

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

// add new user
app.post('/user', (req, res) => {
    console.log("Got post request for user" + res);
    var user = new User({
        user_id: req.body.userId,
        name: req.body.name,
        email: req.body.email,
        isDriver:req.body.isDriver,
        owned_vehicle_id: req.body.ownedVehicle,
    })

    user.save()
        .then((doc) => {
            res.send(doc);
        }, (error) => {
            res.status(400).send(error);
        });
});

//add new vehicle
app.post('/vehicle', (req, res) => {
    console.log("get post request for vehicle" + res);
    var vehicle = new Inventory({
        inventoryID: req.body.inventoryID,
        inventoryType: req.body.inventoryType,
        regNo: req.body.regNo,
        seats: req.body.seats,
        active: req.body.active,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
    })

    vehicle.save()
        .then((doc) => {
            res.send(doc);
        }, (error) => {
            res.status(400).send(error);
        });
})


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

var generateBlockKey = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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

app.post('/bookticket', (req, res) => {
    console.log("got book request");
    let bpId = req.body.bpId;
    let dpId = req.body.dpId;
    let passengerId = req.body.passengerId;


    let routeAllotement = allocateVehicle(bpId, dpId);
    let vehicleId = routeAllotement.inventoryID;
    let price = routeAllotement.price;
    let blockKey = generateBlockKey(5);


    var ticketRecord = new TicketRecord({
        ticket_id: 1,
        passenger_id: passengerId,
        vehicle_id: vehicleId,
        source_id: bpId,
        destination_id: dpId,
        fare: price,
        status:"BOOKED",
        block_key: blockKey,
    });

    RouteAllotment.findOneAndUpdate({allotmentId: vehicleId},
        {$inc: {availableSeats: -1}},
        (err, response) => {
            if (err) {
                res.json(0);
            } else {
                console.log("update");
            }
        });

    ticketRecord.save()
        .then((doc) => {
            res.send(doc);
        }, (error) => {
            console.log(error)
            res.send(400).send(error);
        });
})

app.get('/bpforgivenid', (req, res) => {
console.log("get bp got given id");
    // let routes = Route.find({sourceId:bpID})
    //     .then((routes) => {
    //         console.log(routes);
    //     })
    // let x =0;

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

//getSimulation
app.get('/sim', (req, res) => {
    console.log("all the routes");
    startEglToMarathalli()
    res.send("doing_")
});

function startEglToMarathalli() {

    // getDistanceBetweenPointsInMeters(12.95080, 77.63929, 12.95304, 77.64061)


    var latlong ="12.95080,77.63929;12.95304,77.64061;12.95444,77.64125;12.96087,77.64170;12.96127,77.64157;12.96137,77.64105;12.96081,77.64101;12.95962,77.65090;12.95911,77.65967;12.95936,77.66142;12.95821,77.66763;12.95791,77.67222;12.95446,77.68039;12.95516,77.68790;12.95663,77.69628;12.95650,77.69578;12.95616,77.69585;12.95514,77.70047;12.95683,77.70091;12.95703,77.69935;"
    var  latLongArray = latlong.split(";")
    var delayInSec = 5

    for (var i=0 ;i<latLongArray.length; i++ ){

        var finalLatLongArray = latLongArray[i].split(",");
        var vehicleIdToUpdate = 1; // vehicle id for which lat long will be updated
        var waitTill = new Date(new Date().getTime() + delayInSec * 1000);
        while(waitTill > new Date()){}
        pushToMongo(finalLatLongArray, vehicleIdToUpdate)

    }
}

function pushToMongo(finalLatLongArray, vehicleId){

    var pathSimulation = new PathSimulation({
        lat: finalLatLongArray[0],
        lon: finalLatLongArray[1],
    });

    Inventory.findOneAndUpdate({inventoryID: vehicleId},
        { "$set": {"latitude" : finalLatLongArray[0] , "longitude" : finalLatLongArray[1]}}
    ).exec(function(err, book){
        if(err) {
            console.log(err);
            console.log("ERROR");
        } else {
            console.log("success");
            console.log(finalLatLongArray[0]+" , "+finalLatLongArray[1]);
        }
    });


}
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

app.get('/dropingpoints',(req,res)=> {
    console.log("inside droping..")
    var lat1 = req.query.latitude
    var lon1 = req.query.longitude

    console.log("lat:"+lat1+"long:"+lon1)
    var bpArray = new Array();
    var respMap = new Map();
    var flag=0;


    BoardingPoint.find().stream()
        .on('data', function (doc) {
            //    console.log(doc)
            var distance = getDistanceBetweenPointsInMeters(lat1, lon1, doc.latitude, doc.longitude)
            console.log("distance from user locaton is" + distance + "for bpName:" + doc.bpName)
            if (500 >= distance) {
                bpArray.push(doc)
                //console.log(doc)
                console.log(bpArray)
            }

        })
        .on('error', function (err) {
            console.log(err)
        })
        .on('end', function () {
            // final callback
            if (bpArray.length > 0) {
                //1.Getting the groupids of the bps.
                //2.Form groupids getting the destinations..
                for (i = 0; i < bpArray.length; i++) {
                    var bp = bpArray[i]
                    var destIdArray = new Array();
                    var groupIDArray = new Array();
                    var destinations = new Array();
                    var order
                    Route.find({sourceId: bp.bpId}).then((routes) => {
                        console.log("inside findBySourceId then...")
                        console.log("Routes:" + routes)
                        for (i = 0; i < routes.length; i++) {
                            var route = routes[i];
                            order = route.order
                            groupIDArray.push(route.groupId);
                        }

                    }).then(async () => {
                        console.log("Inside groupidarray then..")
                        for (i = 0; i < groupIDArray.length; i++) {
                            var groupId = groupIDArray[i];
                            var routes = await Route.find({groupId: groupId})
                                var count=0;
                                for (i = 0; i < routes.length; i++) {
                                    var route = routes[i];

                                    if (bp.bpId == route.destinationId || order > route.order) {
                                        continue;
                                    }

                                    destIdArray.push(route.destinationId)
                                }
                                for (i = 0; i < destIdArray.length; i++) {
                                    var destId = destIdArray[i]
                                    var doc = await BoardingPoint.findOne({bpId: destId})
                                    doc["boardingpId"] = bp.bpId
                                        destinations.push({"bpid":bp.bpId, "dest":doc})
                                }




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
                      //  respMap.set(bp.bpId,destinations)
                        console.log("Response is ")
                        res.send(destinations);
                    })


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
                }

            }else {
                res.send(new Array())
            }
        })
});

// app.post('/dropingpoint',(req,res)=>{
//    var destIdArray =req.body.destIdArray
//     for(i=0;i<destIdArray.length;i++){
//                 var destId=destIdArray[i]
//                 BoardingPoint.find({bpId:destId}).then((doc)=>{
//                     destinations.push(doc)
//                 })
//             }
// })






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

app.get('/getvehicle',(req,res)=>{
    var bpId=req.query.bpId
    var dpId=req.query.dpId
    var serviceArray =new Array();
    var groupId;
    //gettng DP group..
    Route.find({destinationId:dpId}).then(async (routes)=>{
        console.log(routes)
        for(i=0;i<routes.length;i++){
            var route=routes[i]
            if(route.sourceId==bpId){
                groupId=route.groupId;
                break;
            }
        }
        // getting all the alloted vehicles for that route..
        var allotedInventory=await RouteAllotment.find({routeGroup:groupId})
        for(i=0;i<allotedInventory.length;i++){
            var inventory = allotedInventory[i];
            var currentVehicleLocation = await Inventory.findOne({inventoryID:inventory.inventoryId})
            console.log("vehicle:"+currentVehicleLocation)
            var bp= await BoardingPoint.findOne({bpId:bpId})
            var distance=getDistanceBetweenPointsInMeters(currentVehicleLocation.latitude,currentVehicleLocation.longitude,bp.latitude,bp.longitude);
            console.log("distance:"+distance);
            if(500<distance){
                serviceArray.push(currentVehicleLocation)
            }

        }
        res.send(serviceArray);
    })
});

app.post('/routeallotment', (req, res) => {
    console.log("Got post request for " + res);
    console.log(req.body.route_id,req.body.sourceId,req.body.destinationId,req.body.groupId,req.body.order)
    var routeAllotment = new RouteAllotment({
        allotmentId: req.body.allotmentId,
        routeGroup : req.body.routeGroup,
        inventoryId : req.body.inventoryId,
        startTime : req.body.startTime,
        endTime : req.body.endTime,
        availableSeats : req.body.availableSeats

    })

    routeAllotment.save()
        .then((doc) => {
            res.send(doc);
        }, (error) => {
            console.log(error)
            res.send(400).send(error);
        });
});

module.exports = {
  app
}
function getDistanceBetweenPointsInMeters(lat1,lon1,lat2,lon2) {

    var a = { "latitude": lat1, "longitude" : lon1 }
    var b = { "latitude":lat2, "longitude":lon2 }
    console.log(haversine(a, b))
    return haversine(a,b)


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

    return {
        price : 10,
        inventoryID : 1
    }

}
