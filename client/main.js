import { Template } from 'meteor/templating';
// import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

import { Rides } from '../both/rides.js'

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  // this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  rides() {
    return Rides.find({});
    // return [
    //   {
    //     bkn_ref: "E01540464",
    //     name: "Anna E (07012307412)",
    //     datetime: "13-jul 8:45",
    //     from: "Sveavagen 89",
    //     to: "Arlanda",
    //     coriders: "Lennart K (01002803465)",
    //     actions: "Edit | Delete"
    //   },
    //   {
    //     bkn_ref: "E01540464",
    //     name: "Anna E (07012307412)",
    //     datetime: "13-jul 8:45",
    //     from: "Sveavagen 89",
    //     to: "Arlanda",
    //     coriders: "Lennart K (01002803465)",
    //     actions: "(Closed)"
    //   },
    // ]
  },
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    Rides.insert({
        bkn_ref: "E01540464",
        name: "Anna E (07012307412)",
        datetime: "13-jul 8:45",
        from: "Sveavagen 89",
        to: "Arlanda",
        coriders: "Lennart K (01002803465)",
        actions: "Edit | Delete"
      });
  },
});
