/**
 * TripsController
 *
 * @description :: Server-side logic for managing trips
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    findAlltrips : function(req,res){
    Trips.query('select trip_id,Vehicle_id,source,destination from trips', function (err,data) {
    // Error handling
          if (err) {
             return console.log(err);
          } else {
             console.log(data);
             res.json(data);
          }
      });
  },
get_timings : function(req,res){

     var vehicle_id=req.param('vehicle_id');
     var source=req.param('from');
     var destination=req.param('to');

     console.log(vehicle_id+source+destination);

    Trips.query('select s1.trip_id trip_id,s1.stop_id,s1.arrival_time,s2.stop_id,s2.arrival_time from \
                (select trip_id,stop_id,arrival_time from stop_times where stop_id ="POT_01" and trip_id in \
                    (select trip_id from stop_times where stop_id="POT_01" intersect select trip_id from stop_times where stop_id="EY_01")) as s1 \
                    join \
                (select trip_id,stop_id,arrival_time from stop_times where stop_id ="EY_01" and trip_id in \
                    (select trip_id from stop_times where stop_id="POT_01" intersect select trip_id from stop_times where stop_id="EY_01")) as s2 \
                on s1.trip_id=s2.trip_id', function(err,data){
    // Error handling
          if (err) {
      return console.log(err);
          } else {
             console.log(data);
             res.json(data);
          }
      });
  } 

};


