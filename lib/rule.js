'use strict';

var Parameter = require('./parameter');

exports.process = function (string, helper, rule, sender) {

  if (!rule.parameters.length)
    return rule.trigger([]);

  var params = [];
  var stop = false;

  rule.parameters.every(function (param) {

    var res = Parameter.process(string, helper, param, sender);
    if (res === false) {
      stop = true;
      return false;
    }
    params.push({ name: param.name, value: res });

    return true;
  });

  if (stop)
    return;

  return rule.trigger(params, helper, sender);
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
