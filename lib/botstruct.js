'use strict'

var stringsToRegexes = require('./utils').stringsToRegexes;
var Rule = require('./rule');
var IOs = require('./ios');
var Storage = require('./storage');
var Session = require('./session');

var sqlite3 = require('sqlite3').verbose();

var __this = module.exports = exports = {

  data: {
    db: null,
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

    // Init database
    __this.data.db = new sqlite3.Database('bot.sql');
    Storage.init(__this);
  },

  testNewCmd: function(string, sender, session) {

    var stop = false;
    __this.data.rules.every(function (rule) {

      rule.command.every(function (cmd) {

        if (cmd.test(string)) {
          session.cmd = rule.name;
          Rule.process(string, __this, rule, sender, session);
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

  digest: function (string, sender) {

    // If request is anonymous
    if (sender.id == undefined)
      __this.testNewCmd(string, sender, Session.getNew(sender.type, null));
    else {

      Session.get(__this, sender.type, sender.id, function(helper, session) {

        if (session.cmd == null)
          helper.testNewCmd(string, sender, session);
        else {

          // Finding rule already initiated
          var r = null;
          __this.data.rules.every(function(rule) {
            if (rule.name == session.cmd) {
              r = rule;
              return false;
            }
            return true;
          });

          if (r)
            Rule.process(string, __this, r, sender, session);
          else {
            // Consider as new command if command initiated cannot be found
            Session.erase(helper, session);
            Session.getNew();
            helper.testNewCmd(string, sender, session);
          }
        }

      });

    }

  },

};
