var haversine = require('haversine-distance');

console.log("Simulation started")
//startEglToMarathalli()
//testing()
startEglToMarathalli()

function startEglToMarathalli() {


    //https://developers.google.com/maps/documentation/utilities/polylineutility
    //http://osmaps.yourbus.in/route/v1/driving/77.6378649,12.9513272;77.6993465,12.9569524
    /*

12.95080,77.63929
12.95304,77.64061
12.95444,77.64125
12.96087,77.64170
12.96127,77.64157
12.96137,77.64105
12.96081,77.64101
12.95962,77.65090
12.95911,77.65967
12.95936,77.66142
12.95821,77.66763
12.95791,77.67222
12.95446,77.68039
12.95516,77.68790
12.95663,77.69628
12.95650,77.69578
12.95616,77.69585
12.95514,77.70047
12.95683,77.70091
12.95703,77.69935
     */
    var latlong ="12.95080,77.63929;12.95304,77.64061;12.95444,77.64125;12.96087,77.64170;12.96127,77.64157;12.96137,77.64105;12.96081,77.64101;12.95962,77.65090;12.95911,77.65967;12.95936,77.66142;12.95821,77.66763;12.95791,77.67222;12.95446,77.68039;12.95516,77.68790;12.95663,77.69628;12.95650,77.69578;12.95616,77.69585;12.95514,77.70047;12.95683,77.70091;12.95703,77.69935;"
    var  latLongArray = latlong.split(";")
    var delayInSec = 5

    for (var i=0 ;i<latLongArray.length; i++ ){

        var finalLatLongArray = latLongArray[i].split(",")
        var waitTill = new Date(new Date().getTime() + delayInSec * 1000);
        while(waitTill > new Date()){}
        pushToMongo(finalLatLongArray)

    }
}

function pushToMongo(finalLatLongArray){
    console.log(finalLatLongArray[0]+" , "+finalLatLongArray[1])
}

