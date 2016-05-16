# botstruct
![alt tag](http://ctsd.github.io/img/botstruct.png)
NodeJS library providing tools to create chat bots. Built to integrate with Express framework.

⚠️ This project is still under development

## INSTALL
You can install the package through npm:
```
npm install https://github.com/ctsd/botstruct.git
```

## USAGE
Here's a sample bot that returns a phone number when the message includes one of the user names:
```
var app = express();
var botstruct = require('botstruct');

var rules = [
    {
      command: [ 'Téléphone', 'Phone' ],
      parameters: [
        {
          name: 'name',
          values: [
            { id: 1, value: "John Doe", phone: "+XXXXXXXX" },
            { id: 2, value: "Boaty McBoatFace", phone: "+YYYYYYYY" },
            { id: 3, value: "Long John Silver", phone: "Raaaaahr" },
          ],
        }
      ],
      trigger: function (parameters, helper, sender) {
        var str = "Sure, that's the phone we've got: " + parameters[0].value.phone;
        IOs.send(str, helper, sender);
      },
    }
  ];

var ios = [
  {
    type: 'facebook',
    access_token: '__REPLACE_ME_WITH_YOUR_PAGE_ACCESS_TOKEN__',
    token: '__REPLACE_ME_WITH_YOUR_APP_TOKEN__',
    webhook: '/facebook/webhook/'
  },
  {
    type: 'web',
    webhook: '/web/webhook/'
  },
];

botstruct.init(app, ios, rules);
```

## TODO
+ Tests
+ More inputs/outputs (Wechat/Slack/more...)
+ Commands that can execute along multiple messages for more interaction
+ More type of parameters
+ Storing in database
