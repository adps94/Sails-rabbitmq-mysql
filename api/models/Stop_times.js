/**
* Stop_times.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	trip_id:'string',
     arrival_time:'string',
     departure_time:'string',
     stop_id:'string',
     stop_sequence:'integer',
     stop_headsign:'string',
     pickup_type:'integer',
     drop_off_type:'integer'

  }
};

