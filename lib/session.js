'use strict';

var Storage = require('./storage');

exports.getNew = function() {
  return {
    cmd: null,
    parameters: [],
    identity: { type: type, id: id }
  };
};

exports.get = function(helper, type, id, callback) {
  Storage.getSession(helper, type, id, function(helper, session) {
    if (session == null) {
      callback(helper, {
        cmd: null,
        parameters: [],
        identity: { type: type, id: id }
      });
    }
    else
      callback(helper, session);
  });
};

exports.erase = function(helper, session) {
  Storage.eraseSession(helper, session);
};

exports.save = function(helper, session) {
  Storage.saveSession(helper, session);
};
