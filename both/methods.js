import { Rides } from '../both/rides.js';

Meteor.methods(
  {
    // {
    //   'ping'({}) {
    //     return "pong";
    //   }
    // },
    'rides.create'(newRide/*TODO: { name: ..., ... }*/) {
      // TODO: validate newRide

      { // doc enrichment
        newRide.bkn_ref = 'R' + Math.floor(Math.random()*(100*1000)); // TODO: it should generate at the server (as method?)
      }

      Rides.insert(newRide);
    },
    'rides.delete'({ rideId }) {
      // TODO: validate ride

      Rides.remove(rideId);
    },
    'rides.update'(ride) {
      // TODO: validate ride
      Rides.update({_id: ride._id}, ride);
    }
  },
);
