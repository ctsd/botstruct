var Botkit = require('../index.js');

var bot = {
  rules: [
    {
      name: 'pizza',
      command: [ 'pizzatime' ],
      parameters: [
        {
          name: 'flavor',
        },
        {
          name: 'size',
        },
        {
          name: 'place',
        }
      ],
      trigger: function (session, helper, sender) {
        IOs.send("Ok! Goodbye.", helper, sender);
      },
    }
  ];

  ios: [
    {
      type: 'facebook',
      access_token: '__ACCESS_TOKEN__',
      token: '__TOKEN__',
    },
    {
      type: 'web',
    }
  ];
};
