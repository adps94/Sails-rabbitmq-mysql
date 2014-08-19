/**
 * VehicleController
 *
 * @description :: Server-side logic for managing vehicles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

findtrip : function(req,res){
    var id=req.param('id');
    console.log(id);
                Vehicle.query('select * from vehicle where vehicle_id = "'+id+'"', function (err,data) {
    // Error handling
          if (err) {
             return console.log(err);
          } else {
             console.log("User found:", data);
             res.json(data);
          }
      });
        },
findAllvehicle : function(req,res){
    Vehicle.query('select vehicle_id,trip_id from vehicle', function (err,data) {
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