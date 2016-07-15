import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Mongo } from 'meteor/mongo';

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
    { // enrich the doc
      newRide.bkn_ref = 'R' + Math.floor(Math.random()*(100*1000)); // TODO: always same ID?
    }
    Rides.insert(newRide);

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
    Rides.remove(this._id)
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
    Rides.update({_id: rideBeingEdited._id}, rideBeingEdited);
    instance.state.set('editing', false);
    instance.state.set('rideBeingEdited', {});
  },
});
