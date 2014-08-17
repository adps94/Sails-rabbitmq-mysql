/**
 * app.js
 *
 * Use `app.js` to run your app without `sails lift`.
 * To start the server, run: `node app.js`.
 * 
 * This is handy in situations where the sails CLI is not relevant or useful.
 *
 * For example:
 *   => `node app.js`
 *   => `forever start app.js`
 *   => `node debug app.js`
 *   => `modulus deploy`
 *   => `heroku scale`
 * 
 *
 * The same command-line arguments are supported, e.g.:
 * `node app.js --silent --port=80 --prod`
 */

// Ensure a "sails" can be located:



var fs = require("fs");
var amqp = require('amqplib');
var when = require('when');
var io = require('socket.io').listen(5000);
var socket=io.on('connection',function(none){}); 

var passed_stops=[];
var remaining_stops=[];

amqp.connect('amqp:localhost').then(function(conn) {
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
            //  console.log(" [x] '%s'", msg.content.toString());
            console.log(prepare(msg.content.toString()));
            var modified=prepare(msg.content.toString());
            repub(modified);
            /*socket.on('my other event', function (data) {  
             console.log(data);
            });*/
          }
      });      
   }).then(null, console.warn);

function prepare(msg)
  {
  	var line1=JSON.parse(msg.split("\r\n")[0]);
    var dm=JSON.parse(msg.split("\r\n")[1]);  
    if(line1.format=="break") {
   // 	console.log("broken geofence "+dm.broken.stop_name);
      //employees.splice(0,1)
    	//passed_stops.push({"stop_seq":remaining_stops[0]["stop_seq"],"stop_name":dm.broken.stop_name,"timestamp":""+dm.broken.timestamp})
    	//remaining_stops.splice(0,1)
    	return null
    }
    if(line1.format=="point")  {
    	var doc=JSON.parse(msg.split("\r\n")[2]);
    	var mdoc={"trip_id":doc.trip_id,"position":{lon:doc.location.lng,lat:doc.location.lat},"timestamp":doc.timestamp,det:{"trip_id":doc.trip_id,"stops_visited":passed_stops,"stops_rem":remaining_stops,"emp":doc.employees}};
      var web={"trip_id":doc.trip_id,"position":doc.location,"timestamp":doc.timestamp,det:{"trip_id":doc.trip_id,"stops_visited":passed_stops,"stops_rem":remaining_stops,"emp":doc.employees}};
      // console.log(mdoc);
       socket.emit('triptrack',web);
       //console.log(doc.location);
      // console.log(doc.timestamp);
        if(dm.create._id!=1)
        {
           dm={"update":dm.create};
           dm.update._id="current";
           doc={ "doc" : mdoc };
        }
        else
           dm["create"]["_id"]="current";
        var ff=[ msg.split("\r\n")[1], JSON.stringify(mdoc),JSON.stringify(dm),JSON.stringify(doc)];
        var final=ff.join("\r\n");
       // console.log(final);
        final+="\r\n";
        return final;
    }

  }
function repub(msg)
{
    amqp.connect('amqp:localhost').then(function(conn1) {
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
