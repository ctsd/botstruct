'use strict'

var stringsToRegexes = require('./utils').stringsToRegexes;
var getMessage = require('./utils').getMessage;
var Rule = require('./rule');
var IOs = require('./ios');
var Storage = require('./storage');
var Session = require('./session');

var sqlite3 = require('sqlite3').verbose();

var __this = module.exports = exports = {

  data: {
    message_notfound: null,
    db: null,
    rules: [],
    ios: [],
    app: null,
  },

  init: function (app, config) {

    __this.data.app = app;
    __this.data.message_notfound = config.message_notfound;

    // Checking ios
    if (Object.prototype.toString.call(config.ios) === '[object Array]') {

      __this.data.ios = [];

      config.ios.every(function (io) {
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
    if (Object.prototype.toString.call(config.rules) === '[object Array]') {

      __this.data.rules = [];

      config.rules.forEach(function (rule) {
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

        if (string.match(cmd) != null) {
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

    IOs.send(getMessage(__this.data.message_notfound, "I don't understand"), __this, sender);

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
