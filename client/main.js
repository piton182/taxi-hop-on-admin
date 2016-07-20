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
    showDebugInfo: true,
  });
});

Template.hello.onRendered(function helloOnRendered() {
	this.$('#my-datepicker').datepicker();
});

Template.hello.helpers({
  showDebugInfo() {
    return Template.instance().state.get('showDebugInfo');
  },
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
  rideFormModelStringified() {
    const instance = Template.instance();
    return JSON.stringify(
      instance.state.get('editing') ? instance.state.get('rideBeingEdited') : instance.state.get('newRide'),
      null,
      ' '
    );
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

  formatDate(unix) {
    return moment.unix(unix).format("MM/DD/YYYY HH:mm");
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
  'blur .js-rideform-field-date'(event, instance) {
    const rideFormModelId = instance.state.get('editing') ? 'rideBeingEdited' : 'newRide';
    const rideFormModel = instance.state.get(rideFormModelId);
    rideFormModel.date = event.target.value;
    instance.state.set(rideFormModelId, rideFormModel);
  },
  'blur .js-rideform-field-timeh'(event, instance) {
    const rideFormModelId = instance.state.get('editing') ? 'rideBeingEdited' : 'newRide';
    const rideFormModel = instance.state.get(rideFormModelId);
    rideFormModel.timeh = event.target.value;
    instance.state.set(rideFormModelId, rideFormModel);
  },
  'blur .js-rideform-field-timem'(event, instance) {
    const rideFormModelId = instance.state.get('editing') ? 'rideBeingEdited' : 'newRide';
    const rideFormModel = instance.state.get(rideFormModelId);
    rideFormModel.timem = event.target.value;
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
    const newRideFormModel = instance.state.get('newRide')
    const newRide = {
      name: newRideFormModel.name,
      phone: newRideFormModel.phone,
      datetime: moment(`${newRideFormModel.date} ${newRideFormModel.timeh}:${newRideFormModel.timem}`, "MM/DD/YYYY HH:mm").unix(),
      from: newRideFormModel.from,
      to: newRideFormModel.to,
    }

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
    const datetime = faker.date.recent();
    const newRide = {
      name: faker.name.findName(),
      phone: faker.phone.phoneNumberFormat(),
      date: moment(datetime).format("MM/DD/YYYY"),
      timeh: s.pad(moment(datetime).hours(), 2, '0'),
      timem: s.pad(moment(datetime).minutes(), 2, '0'),
      from: faker.address.streetAddress(),
      to: Airports.findOne().name, // TODO: always takes 1st airport; take random
    }
    instance.state.set('newRide', newRide);
  },
  'click .js-delete-ride'(event, instance) {
    Meteor.call('rides.delete', { rideId: this._id }/*, no callback*/);
  },
  'click .js-edit-ride'(event, instance) {
    instance.state.set('editing', true);
    const rideBeingEdited = {
      _id: this._id,
      bkn_ref: this.bkn_ref,
      name: this.name,
      phone: this.phone,
      date: moment.unix(this.datetime).format("MM/DD/YYYY"),
      timeh: s.pad(moment.unix(this.datetime).hours(), 2, '0'),
      timem: s.pad(moment.unix(this.datetime).minutes(), 2, '0'),
      from: this.from,
      to: this.to,
    }
    instance.state.set('rideBeingEdited', rideBeingEdited);
  },
  'click .js-editride-cancel'(event, instance) {
    instance.state.set('editing', false);
    instance.state.set('rideBeingEdited', {});
  },
  'click .js-editride-save'(event, instance) {
    const rideBeingEdited = instance.state.get('rideBeingEdited');
    const rideToUpdate = {
      name: rideBeingEdited.name,
      phone: rideBeingEdited.phone,
      datetime: moment(`${rideBeingEdited.date} ${rideBeingEdited.timeh}:${rideBeingEdited.timem}`, "MM/DD/YYYY HH:mm").unix(),
      from: rideBeingEdited.from,
      to: rideBeingEdited.to,
    }
    Meteor.call('rides.update', rideToUpdate);
    instance.state.set('editing', false);
    instance.state.set('rideBeingEdited', {});
  },
});
