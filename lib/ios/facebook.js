'use strict';

var bodyParser = require('body-parser');
var request = require('request');
var IOs = require('../ios');

exports.check = function (io) {

  if (io.access_token === undefined) {
    console.log('Page access token is required for Facebook ios');
    return false;
  }

  if (io.token === undefined) {
    console.log('Token is required for Facebook ios');
    return false;
  }

  if (io.webhook === undefined)
    io.webhook = '/facebook/webhook/';

  return true;
};

exports.setup = function (helper, io) {

  helper.data.app.use(bodyParser.json());
  helper.data.app.use(bodyParser.urlencoded({
    extended: true
  }));

  helper.data.app.get(io.webhook, function (req, res) {
    if (req.query['hub.verify_token'] === io.token) {
      res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
  });

  helper.data.app.post(io.webhook, function (req, res) {
    var messaging_events = req.body.entry[0].messaging;
    for (var i = 0; i < messaging_events.length; i++) {
      var event = req.body.entry[0].messaging[i];
      if (event.message && event.message.text) {
        var text = event.message.text;
        var io = {
          type: 'facebook',
          id: event.sender.id,
        };
        helper.digest(text, io);
      }
    }
    res.sendStatus(200);
  });

};

exports.send = function (message, helper, sender) {

  var messageData = {
    text: message
  }
  var io = IOs.getIO("facebook", helper);
  if (!io)
    return ;

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: io.access_token },
    method: 'POST',
    json: {
      recipient: { id: sender.id },
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });


};
