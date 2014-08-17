/**
 * StopsController
 *
 * @description :: Server-side logic for managing stops
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  findstops : function(req,res){
    var id=req.param('id');
    Stops.query('select * from stops where trip_id like "'+'%'+id+'%'+'"', function (err,data) {
    // Error handling
          if (err) {
             return console.log(err);
          } else {
             console.log("User found:", data);
             res.json(data);
          }
      });
  },
  findAllstops : function(req,res){
    Stops.query('select stop_name,stop_id from stops', function (err,data) {
    // Error handling
          if (err) {
             return console.log(err);
          } else {
             console.log(data);
             res.json(data);
          }
      });
  },
  findstops_from : function(req,res){
    var id=req.param('id');
    Stops.query('select stop_name,stop_id from stops where stop_id in \ (select distinct stop_id from stop_times where trip_id in \
                    (select trip_id from stop_times where stop_id like "'+'%'+id+'%'+'"))', function (err,data) {
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

