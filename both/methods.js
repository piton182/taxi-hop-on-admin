import { Rides } from '../both/rides.js';

Meteor.methods(
  {
    'rides.create'(newRide) {
      // TODO: validate newRide

      { // doc enrichment
        // TODO: poor algorithm
        newRide.bkn_ref = 'R' + Math.floor(Math.random()*(100*1000)); // TODO: it should generate at the server (as method?)
      }

      Rides.insert(newRide);
    },
    'rides.delete'({ rideId }) {
      // TODO: validate ride

      Rides.remove(rideId);
    },
    'rides.update'(ride = { _id, bkn_ref }) {
      // TODO: validate ride

      Rides.update({_id: ride._id}, ride);
    }
  },
);
