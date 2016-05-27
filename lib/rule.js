'use strict';

var Parameter = require('./parameter');
var Session = require('./session');

exports.process = function (string, helper, rule, sender, session) {

  if (!rule.parameters.length)
    return rule.trigger([]);

  var stop = false;
  rule.parameters.every(function (param) {

    // Check if parameter has already been defined
    var skip = false;
    var pram = null;
    for (var index in session.parameters) {
      if (index == param.name) {
        pram = session.parameters[index];
        if (session.parameters[index].awaitingInput === undefined)
          skip = true;
        break;
      }
    }

    if (!skip) {

      // Process parameter
      var res = Parameter.process(string, helper, param, pram, sender);
      session.parameters[param.name] = res;
      if (res === false || res.awaitingInput !== undefined) {
        stop = true;
        return false;
      }

    }

    return true;
  });

  if (stop) {
    Session.erase(helper, session);
    Session.save(helper, session);
    return;
  }

  rule.trigger(session, helper, sender);
  Session.erase(helper, session);

  return true;
};

exports.check = function (rule) {

  // Checking presence of command
  if (rule.command == undefined) {
    console.log('Command not defined');
    return false;
  }

  // Checking validity of command
  if (typeof rule.command === 'string')
    rule.command = [ rule.command ];
  else if (Object.prototype.toString.call(rule.command) === '[object Array]') { }
  else {
    console.log('Command not valid');
    return false;
  }

  // Checking presence of parameters
  if (rule.parameters == undefined)
    rule.parameters = [];

  // Checking validity of parameters
  if (Object.prototype.toString.call(rule.command) !== '[object Array]') {
    console.log('Parameters not valid');
    return false;
  }

  return true;
};
