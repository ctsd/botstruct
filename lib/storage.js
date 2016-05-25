'use strict';

exports.init = function(helper) {

  helper.data.ios.every(function(io) {

    helper.data.db.serialize(function() {

      var count = 0;
      helper.data.db.each("SELECT * FROM sqlite_master WHERE name ='sessions_" + io.type + "' and type='table' LIMIT 1", function(err, table) {
        count++;
      },
      function() {
        if (count == 0)
          helper.data.db.run("CREATE TABLE sessions_" + io.type + " (id TEXT, session TEXT)");
      });

    });

    return true;
  });

};

exports.getSession = function(helper, type, id, callback) {

  helper.data.db.serialize(function() {

    var sess = null;
    helper.data.db.each("SELECT session FROM sessions_" + type + " WHERE id ='" + id + "' LIMIT 1", function(err, result) {
      sess = JSON.parse(result.session);
      sess.identity = { type: type, id: id };
    }, function() {
      callback(helper, sess);
    });

  });

};

exports.eraseSession = function(helper, session) {

  helper.data.db.serialize(function() {
    helper.data.db.exec("DELETE FROM sessions_" + session.identity.type + " WHERE id ='" + session.identity.id + "'");
  });

};

exports.saveSession = function(helper, session) {
  var s = {
    cmd: session.cmd,
    parameters: session.parameters
  };

  helper.data.db.serialize(function() {
    helper.data.db.exec("INSERT INTO sessions_" + session.identity.type + " VALUES ('" + session.identity.id + "', '" + JSON.stringify(s) + "')");
  });
};
