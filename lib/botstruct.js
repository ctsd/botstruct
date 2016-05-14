'use strict'

var stringsToRegexes = require('./utils').stringsToRegexes;
var Rule = require('./rule');
var IOs = require('./ios');

var __this = module.exports = exports = {

  data: {
    rules: [],
    ios: [],
    app: null,
  },

  init: function (app, ios, rules) {

    __this.data.app = app;

    // Checking ios
    if (Object.prototype.toString.call(ios) === '[object Array]') {

      __this.data.ios = [];

      ios.every(function (io) {
        if (IOs.check(io)) {
          IOs.setup(__this, io);
          __this.data.ios.push(io);
        }
        return true;
      });

    }
    else
      console.log('ios must be an array');

    // Checking rules
    if (Object.prototype.toString.call(rules) === '[object Array]') {

      __this.data.rules = [];

      rules.forEach(function (rule) {
        if (Rule.check(rule)) {
          rule.command = stringsToRegexes(rule.command);
          __this.data.rules.push(rule);
        }
      });

    }
    else
      console.log('rules must be an array');

  },

  digest: function (string, sender) {

    var stop = false;
    __this.data.rules.every(function (rule) {

      rule.command.every(function (cmd) {

        if (cmd.test(string)) {
          Rule.process(string, __this, rule, sender);
          stop = true;
          return false;
        }

        return true;
      });

      if (stop)
        return false;

      return true;
    });

    if (stop)
      return ;

    IOs.send("I don't understand", __this, sender);

  },

};
