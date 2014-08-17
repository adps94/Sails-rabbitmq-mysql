/**
* Stops.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

      trip_id:"string",
  	  stop_id:"string",
      stop_name:'string',
      stop_desc:'text',
      stop_lat:'float',
      stop_lng:'float'

  }
};

