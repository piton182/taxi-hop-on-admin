"R"+Math.floor(Math.random()*(100*1000));import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import './main.html';

import { Rides } from '../both/rides.js'

Template.hello.onCreated(function helloOnCreated() {
  this.state = new ReactiveDict()
  this.state.setDefault({
    newRide: {},
    editing: false,
    // rideBeingEdited: {},
  });
});

Template.hello.helpers({
  rides() {
    return Rides.find({});
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
  }
});

Template.hello.events({
  'blur .js-newride-field-name'(event, instance) {
    const newRide = instance.state.get('newRide');
    newRide.name = event.target.value;
    instance.state.set('newRide', newRide);
  },
  'blur .js-newride-field-phone'(event, instance) {
    const newRide = instance.state.get('newRide');
    newRide.phone = event.target.value;
    instance.state.set('newRide', newRide);
  },
  'blur .js-newride-field-datetime'(event, instance) {
    const newRide = instance.state.get('newRide');
    newRide.datetime = event.target.value;
    instance.state.set('newRide', newRide);
  },
  'blur .js-newride-field-from'(event, instance) {
    const newRide = instance.state.get('newRide');
    newRide.from = event.target.value;
    instance.state.set('newRide', newRide);
  },
  'blur .js-newride-field-to'(event, instance) {
    const newRide = instance.state.get('newRide');
    newRide.to = event.target.value;
    instance.state.set('newRide', newRide);
  },
  'click .js-newride-submit'(event, instance) {
    const newRide = instance.state.get('newRide')
    { // enrich the doc
      newRide.bkn_ref = "R"+Math.floor(Math.random()*(100*1000));; // TODO: always same ID?
    }
    Rides.insert(newRide);

    // clear the new ride form model
    instance.state.set('newRide', {});
  },
  'click .js-newride-fake'(event, instance){
    const newRide = instance.state.get('newRide');
    newRide.name = faker.name.findName(),
    newRide.phone = faker.phone.phoneNumberFormat(),
    newRide.datetime = faker.date.recent(),
    newRide.from = faker.address.streetAddress(),
    newRide.to = faker.address.secondaryAddress()
    instance.state.set('newRide', newRide);
  },
  'click .js-delete-ride'(event, instance) {
    Rides.remove(this._id)
  },
  'click .js-edit-ride'(event, instance) {
    instance.state.set('editing', true);
    instance.state.set('rideBeingEdited', this);
  },
  'click .js-editride-cancel'(event, instance) {
    instance.state.set('editing', false);
    instance.state.set('rideBeingEdited', null);
  },
});
