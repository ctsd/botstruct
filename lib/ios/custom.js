'use strict';

exports.setup = function (helper, io) {
  io.setup(helper, io);
};

exports.send = function (message, helper, sender) {
  io.send(message, helper, sender);
};
