'use strict';

function stringToRegex(string) {

  string = string.replace(/[àáâäãåā]/gi, "[àáâäãåāa]");
  string = string.replace(/[èéêëēėę]/gi, "[èéêëēėęe]");
  string = string.replace(/[îïíīįì]/gi, "[îïíīįìi]");
  string = string.replace(/[ôöòóøōõ]/gi, "[ôöòóøōõo]");
  string = string.replace(/[ûüùúū]/gi, "[ûüùúūu]");

  var re = new RegExp(string, "gi");

  return re;
}

exports.stringsToRegexes = function (strings) {
  var regexes = [];

  strings.forEach(function (string) {
    regexes.push(stringToRegex(string));
  });

  return (regexes);
}

exports.getMessage = function (messages, default_message) {
  if (messages !== undefined && messages != null) {
    if (Object.prototype.toString.call(messages) === '[object Array]')
      return messages[Math.floor(Math.random()*messages.length)];
    else if (typeof messages == "string")
      return messages;
  }
  return default_message; // Default message
}
