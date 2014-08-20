var fs = require("fs");
var amqp = require('amqplib');
var when = require('when');
var io = require('socket.io').listen(3000);
var socket=io.on('connection',function(none){});

var passed_stops={};
var remaining_stops={};

var http = require('http')
function requestHandler(req, res) {
    var reqarr=req.url.split("/")
    if(reqarr[1]=="last_stop")
        {
            var request = require("request");
            request("http://54.89.248.120:9200/rabbit4/pin/current", function(error, response, body) {
                var esj=JSON.parse(body);
                if(esj._source.det.stops_visited.length!=0)
                    res.end(JSON.stringify(esj._source.det.stops_visited[esj._source.det.stops_visited.length-1]));
                else
                   res.end("{}");
            });


/*              if(passed_stops["a"].length!=0)
                        res.end(JSON.stringify(passed_stops[reqarr[2]][passed_stops[reqarr[2]].length-1]))
                else
                        res.end("{}");*/
        }
}

http.createServer(requestHandler).listen(9000);

function get_stops(trip_id){
    var request = require("request");
    request("http://54.89.248.120:1337/stops/findstops/"+trip_id, function(error1, response1, body1) {
      var stops=JSON.parse(body1);
    request("http://54.89.248.120:1337/stop_times/findstop_time/"+trip_id, function(error, response, body) {
        console.log(body);
        var fetch_stops=JSON.parse(body);
        remaining_stops[fetch_stops[0].trip_id]=[];
        passed_stops[fetch_stops[0].trip_id]=[];
        for (var i = 0; i < fetch_stops.length; i++) {
            for (var j = 0; j <stops.length; j++) {
             if(stops[j].stop_id==fetch_stops[i].stop_id){
              remaining_stops[fetch_stops[0].trip_id][i]={ sch_time:fetch_stops[i].arrival_time,place: stops[j].stop_name,stop_id:fetch_stops[i].stop_id,stop_seq:fetch_s$
               }
            };

        }
    });
  });
}
amqp.connect('amqp:54.89.248.120').then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
    return conn.createChannel().then(function(ch) {
        var ok = ch.assertExchange('realtime', 'direct', {durable: false});
          ok = ok.then(function() {
            return ch.assertQueue('trip', {exclusive: false});
          });
          ok = ok.then(function(qok) {
            return ch.bindQueue(qok.queue, 'realtime', 'key').then(function() {
            return qok.queue;
            });
          });
          ok = ok.then(function(queue) {
            return ch.consume(queue, logMessage, {noAck: true});
          });
            return ok.then(function() {
            console.log(' [*] Waiting for logs. To exit press CTRL+C');
          });

        function logMessage(msg) {
            console.log(" before '%s'", msg.content.toString());
            var prep=prepare(msg.content.toString());
                if(prep!=null){
            console.log(" after '%s'",prep);
            repub(prep);}
          }
      });
   }).then(null, console.warn);


function prepare(msg)
  {
    var line1=JSON.parse(msg.split("\r\n")[0]);
    var dm=JSON.parse(msg.split("\r\n")[1]);
    if(line1.format=="break") {
      console.log("broken geofence "+dm.broken.stop_name);
      if(remaining_stops[dm.broken.trip_id]!=undefined){
      pass(dm.broken.stop_id,dm.broken.trip_id,dm.broken.timestamp);
    }
      return null
    }
    if(line1.format=="point")  {
      var doc=JSON.parse(msg.split("\r\n")[2]);
      var mdoc={"trip_id":doc.trip_id,"location":doc.location,"timestamp":doc.timestamp,det:{"trip_id":doc.trip_id,"stops_visited":passed_stops[doc.trip_id],"stops_rem":$
      var web={"trip_id":doc.trip_id,"position":{lng:doc.location.lon,lat:doc.location.lat},"timestamp":doc.timestamp,det:{"trip_id":doc.trip_id,"stops_visited":passed_s$
       socket.emit('triptrack',web);
        if(dm.create._id!=1)
        {
           dm={"update":dm.create};
           dm.update._id="current";
           doc={ "doc" : mdoc };
        }
        else
        {
           dm["create"]["_id"]="current";
           get_stops(doc.trip_id)
      var ff=[ msg.split("\r\n")[1], JSON.stringify(mdoc),JSON.stringify(dm),JSON.stringify(doc)];
        var final=ff.join("\r\n");
        final+="\r\n";
        return final;
    }

  }
}
function pass(stop_name,trip_id,ts){
    var found=-1;
    console.log(remaining_stops);
        console.log("---");
        console.log(stop_name);
        console.log(trip_id);
        console.log(ts);
        console.log("---");
    for(var i=0;i<remaining_stops[trip_id].length;i++)
        if(remaining_stops[trip_id][i].stop_id==stop_name){
            found=remaining_stops[trip_id][i].stop_seq;
     break;
        }
        console.log(found);
    for(var i=0;remaining_stops[trip_id][0].stop_seq<=found;i++)
    {
        var temp=remaining_stops[trip_id][0];
        temp.arrival_time=ts;
        passed_stops[trip_id].push(temp);
        remaining_stops[trip_id].splice(0,1);
        if(remaining_stops[trip_id].length==0)
        {
            break;
            //the trip is over here..
        }
    }

}


function repub(msg)
{
    amqp.connect('amqp:54.89.248.120').then(function(conn1) {
      return when(conn1.createChannel().then(function(ch1) {
          var ex = 'realtime1';
          var ok = ch1.assertExchange(ex, 'direct', {durable: false});
          var message =msg;

          return ok.then(function() {
             ch1.publish(ex, 'key1', new Buffer(message));
             // console.log(" [x] Sent '%s'", message);
             return ch1.close();
          });
      })).ensure(function() { conn1.close(); });
    }).then(null, console.warn);
}


var sails;
try {
  sails = require('sails');
} catch (e) {
  console.error('To run an app using `node app.js`, you usually need to have a version of `sails` installed in the same directory as your app.');
  console.error('To do that, run `npm install sails`');
  console.error('');
  console.error('Alternatively, if you have sails installed globally (i.e. you did `npm install -g sails`), you can use `sails lift`.');
  console.error('When you run `sails lift`, your app will still use a local `./node_modules/sails` dependency if it exists,');
  console.error('but if it doesn\'t, the app will run with the global sails instead!');
  return;
}

// Try to get `rc` dependency
var rc;
try {
  rc = require('rc');
} catch (e0) {
  try {
    rc = require('sails/node_modules/rc');
  } catch (e1) {
    console.error('Could not find dependency: `rc`.');
    console.error('Your `.sailsrc` file(s) will be ignored.');
    console.error('To resolve this, run:');
    console.error('npm install rc --save');
    rc = function () { return {}; };
  }
}


// Start server
sails.lift(rc('sails'));


