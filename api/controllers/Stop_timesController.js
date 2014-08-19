
module.exports = {
	                                                                                   

/**
 * Stop_timesController
 *
 * @description :: Server-side logic for managing stop_times
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
 findstop_time: function(req, res) {
      var id1=req.param('id');
      //Console log --> id
      console.log(id1);
    Stop_times.query('select * from stop_times where trip_id ="'+id1+'"', function (err,data) {
    // Error handling
          if (err) {
             return console.log(err);
          } else {
             console.log("User found:", data);
             res.json(data);
          }
      });
    }

};




};

