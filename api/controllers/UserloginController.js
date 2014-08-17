/**
 * UserloginController
 *
 * @description :: Server-side logic for managing userlogins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  findvehicle : function(req,res){
    var id=req.param('id');
    console.log(id);
    Userlogin.query('select emp_id from userlogin where email like "'+'%'+id+'%'+'"', function (err,data) {
    // Error handling
          if (err) {
             return console.log(err);
          } else {
             //console.log(data);
             var a=data[0].emp_id;
             //console.log(a);
               Employee.query('select vehicle_id from employee where emp_id="'+a+'"', function (err,data1) {

                  console.log(data1);
                  res.json(data1);
               });    
          }
      });
  }
  
};

