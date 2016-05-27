'use strict';

var stringsToRegexes = require('./utils').stringsToRegexes;
var getMessage = require('./utils').getMessage;
var IOs = require('./ios');

exports.processValues = function(string, helper, parameter, sender) {
  var scores = [];
  parameter.values.every(function (value) {

    var tokens = stringsToRegexes(value.value.split(" "));
    var score = 0;
    tokens.every(function (tok) {
      if (string.match(tok) != null)
        score++;
      return true;
    });

    if (score) {

      // Ignore if score is too low
      if (scores.length && score < scores[0].score)
        return true;

      // Reset if score meets a new record
      if (!scores.length || score > scores[0].score)
        scores = [];
      scores.push({ score: score, value: value });
    }

    return true;
  });

  if (!scores.length) {
    // Asking for parameter input
    var str = "Which " + parameter.name + " do you mean ?";
    str = getMessage(parameter.messages.nope, str);
    IOs.send(str, helper, sender);
    return { awaitingInput: true };
  }
  else if (scores.length > 1) {
    // Asking for parameter value choice
    var str = getMessage(parameter.messages.choose, "Please be more precise: ");
    for (var i = 0 ; i < scores.length ; i++)
      str += (i == 0 ? "" : ", ") + scores[i].value.value;
    IOs.send(str, helper, sender);
    return { awaitingInput: true };
  }
  else if (scores.length == 1) {
    // Parameter OK, proceed
    return scores[0].value;
  }

  return false;
};

exports.process = function (string, helper, parameter, current_state, sender) {

  if (parameter.values !== undefined)
    return exports.processValues(string, helper, parameter, sender);

  if (!current_state || current_state.awaitingInput === undefined) {
    var str = "Which " + parameter.name + " do you mean ?";
    str = getMessage(parameter.messages.ask, str);
    IOs.send(str, helper, sender);
    return { awaitingInput: true };
  }
  return string;

}
