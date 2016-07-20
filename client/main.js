import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Mongo } from 'meteor/mongo';

import './main.html';

import { Rides } from '../both/rides.js'
import { Airports } from '../both/airports.js'

Template.hello.onCreated(function helloOnCreated() {
  this.state = new ReactiveDict()
  this.state.setDefault({
    newRide: {},
    editing: false,
    // rideBeingEdited: {},
  });

  // Meteor.call(
  //   'ping',
  //   {},
  //   (err, res) => {
  //     if (err) {
  //       alert(err);
  //     } else {
  //       alert(res);
  //     }
  //   }
  // );
});

Template.hello.onRendered(function helloOnRendered() {
	this.$('#my-datepicker').datepicker();
});

Template.hello.helpers({
  rides() {
    return Rides.find();
  },
  isRidesEmpty() {
    return Rides.find().count() == 0;
  },
  editing() {
    const instance = Template.instance();
    return instance.state.get('editing');
  },
  rideFormModel() {
    const instance = Template.instance();
    return instance.state.get('editing') ? instance.state.get('rideBeingEdited') : instance.state.get('newRide');
  },
  rideBeingEdited() {
    const instance = Template.instance();
    return instance.state.get('rideBeingEdited');
  },
  editingThisRide() {
    const instance = Template.instance();
    return instance.state.get('rideBeingEdited')._id === this._id;
  },

  airportOptions() {
    return Airports.find();
  },
  isAirportSelected(airportName) {
    const instance = Template.instance();
    const rideFormModelId = instance.state.get('editing') ? 'rideBeingEdited' : 'newRide';
    const rideFormModel = instance.state.get(rideFormModelId);
    return (rideFormModel.to === airportName);
  },
});

Template.hello.events({
  'blur .js-rideform-field-name'(event, instance) {
    const rideFormModelId = instance.state.get('editing') ? 'rideBeingEdited' : 'newRide';
    const rideFormModel = instance.state.get(rideFormModelId);
    rideFormModel.name = event.target.value;
    instance.state.set(rideFormModelId, rideFormModel);
  },
  'blur .js-rideform-field-phone'(event, instance) {
    const rideFormModelId = instance.state.get('editing') ? 'rideBeingEdited' : 'newRide';
    const rideFormModel = instance.state.get(rideFormModelId);
    rideFormModel.phone = event.target.value;
    instance.state.set(rideFormModelId, rideFormModel);
  },
  'blur .js-rideform-field-datetime'(event, instance) {
    const rideFormModelId = instance.state.get('editing') ? 'rideBeingEdited' : 'newRide';
    const rideFormModel = instance.state.get(rideFormModelId);
    rideFormModel.datetime = event.target.value;
    instance.state.set(rideFormModelId, rideFormModel);
  },
  'blur .js-rideform-field-from'(event, instance) {
    const rideFormModelId = instance.state.get('editing') ? 'rideBeingEdited' : 'newRide';
    const rideFormModel = instance.state.get(rideFormModelId);
    rideFormModel.from = event.target.value;
    instance.state.set(rideFormModelId, rideFormModel);
  },
  'blur .js-rideform-field-to'(event, instance) {
    const rideFormModelId = instance.state.get('editing') ? 'rideBeingEdited' : 'newRide';
    const rideFormModel = instance.state.get(rideFormModelId);
    rideFormModel.to = event.target.value;
    instance.state.set(rideFormModelId, rideFormModel);
  },
  'click .js-rideform-submit'(event, instance) {
    const newRide = instance.state.get('newRide')

    Meteor.call('rides.create', newRide,
      (err, res) => {
        if (err) {
          // TODO: do not know how alert the end user yet
        } else { /* success! */ }
      }
    );

    // clear the new ride form model
    instance.state.set('newRide', {});
  },
  'click .js-rideform-fake'(event, instance){
    const newRide = instance.state.get('newRide');
    newRide.name = faker.name.findName(),
    newRide.phone = faker.phone.phoneNumberFormat(),
    newRide.datetime = faker.date.recent(),
    newRide.from = faker.address.streetAddress(),
    newRide.to = faker.address.streetAddress()
    instance.state.set('newRide', newRide);
  },
  'click .js-delete-ride'(event, instance) {
    Meteor.call('rides.delete', { rideId: this._id }/*, no callback*/);
  },
  'click .js-edit-ride'(event, instance) {
    instance.state.set('editing', true);
    instance.state.set('rideBeingEdited', this);
  },
  'click .js-editride-cancel'(event, instance) {
    instance.state.set('editing', false);
    instance.state.set('rideBeingEdited', {});
  },
  'click .js-editride-save'(event, instance) {
    const rideBeingEdited = instance.state.get('rideBeingEdited');
    Meteor.call('rides.update', rideBeingEdited);
    instance.state.set('editing', false);
    instance.state.set('rideBeingEdited', {});
  },
});
