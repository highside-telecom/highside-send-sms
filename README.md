
# highside-send-sms

Send SMS via Highside Platform by submitting an HTTP POST request with a JSON
payload to your project's URL.


## Getting Started

Below you will find instructions on how to get your SMS project up and running.


### Node.js

[Install Node.js][install-node] on your system.


### Highside Platform Account & Project

Head over to [Highside Platform][highside-platform], and create an account if
you haven't done so already. Sending SMS messages and making voice calls costs
money (please see international [SMS rates][sms-rates] and
[voice rates][voice-rates]), so keep your account balance positive.

Once you're logged in, choose [HTTP POST to SMS][create-project] project from
the project template selection screen. Note the project's trigger URL. By
default the URL is publicly accessible, so be sure to set *Authentication* to
*Bearer Token* if you wish to protect it with a shared secret token.


## Send SMS

Install `highside-send-sms` into an existing Node.js project.

```bash
npm install --save highside-send-sms
```

Put the following code snippet into a Javascript file (e.g. `test.js`). The
example shows both regular callback and also promise-style function calls.

```js

var send_sms = require('highside-send-sms');

var sms = {
    url:     '<PROJECT TRIGGER URL>',
    to:      '<RECIPIENT PHONE NUMBER>',
    from:    'Highside',
    message: 'Hello, friend!',
    //token: '<SECRET AUTH TOKEN>'
};

//
// callback style
//
send_sms(sms, function (err, response) {
    if (err) {
        console.error(err);
        return;
    }
    console.log(response);
});

//
// promise style
//
send_sms(sms)
    .then(console.log)
    .catch(console.error);

```

Invoke the script:

```bash
node test.js
```


## License

[MIT](LICENSE.md)


[install-node]: https://nodejs.org/en/download/package-manager/
[highside-platform]: https://platform.highside.net
[sms-rates]: https://platform.highside.net/rates/sms
[voice-rates]: https://platform.highside.net/rates/voice
[create-project]: https://platform.highside.net/app/projects/create
