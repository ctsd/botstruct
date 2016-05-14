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
