'use strict';

exports.check = function (io) {

  if (io.webhook === undefined)
    io.webhook = '/web/webhook/';

  return true;
};

exports.setup = function (helper, io) {

  helper.data.app.post(io.webhook, function (req, res) {

    var message = req.body.message;
    var io = {
      type: 'web',
      res: res
    };

    helper.digest(message, io);

  });

};

exports.send = function (message, helper, sender) {
  sender.res.send(message);
};
