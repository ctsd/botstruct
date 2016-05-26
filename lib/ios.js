'use strict';

var Facebook = require('./ios/facebook');
var Web = require('./ios/web');
var Custom = require('./ios/custom');

exports.check = function (io) {

  switch (io.type) {
    case 'facebook':
      return Facebook.check(io);
    case 'web':
      return Web.check(io);
  }

  console.log('type "' + io.type + '" does not exist');
  return false;
};

exports.setup = function (helper, io) {

  switch (io.type) {
    case 'facebook':
      return Facebook.setup(helper, io);
    case 'web':
      return Web.setup(helper, io);
    case 'custom':
      return Custom.setup(helper, io);
  }

  console.log('type "' + io.type + '" does not exist');
  return false;

};

exports.send = function (message, helper, sender) {

  switch (sender.type) {
    case 'facebook':
      return Facebook.send(message, helper, sender);
    case 'web':
      return Web.send(message, helper, sender);
    case 'custom':
      return Custom.send(message, helper, sender);
  }

  console.log('type "' + sender.type + '" does not exist');
  return false;

};

exports.getIO = function (type, helper) {

  var io = null;

  helper.data.ios.every(function (item) {
    if (item.type == type) {
      io = item;
      return false;
    }
    return true;
  });

  return io;

};
