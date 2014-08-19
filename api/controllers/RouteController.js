/**
 * RouteController
 *
 * @description :: Server-side logic for managing routes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

create: function(req, res, next) {

    var userObj = {
      trip_id: req.param('trip_id'),
      vehicle_id:req.param('vehicle_id'),
      routes: req.param('route')
    }
   console.log(userObj.routes.length);
    // Create a User with the params sent from
    // the sign-up form --> new.ejs
    Route.create(userObj, function userCreated(err, user) {

      // // If there's an error
      // if (err) return next(err);

      if (err) {
        console.log(err);
        }
      else
        res.json(user);
    });
  },
  findbyid: function(req, res) {
      var id1=req.param('trip_id');
      //Console log --> id
      console.log(id1);
     Route.findOne({trip_id:id1}, function(err,route) {
        if (err) {
            return null;
        }else{
                if(route===undefined)
                        return res.json({undefined:true});
            console.log(route.routes.length);
            //var a= JSON.stringify(shape);
            res.json(route);
        }
    });
    }

};
