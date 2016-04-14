makemerch
==================

Generates gr8 merchandise! As seen on [Non-Stop Scroll Shop](http://nonstopscrollshop.com/).

Installation
------------

    npm install makemerch

Usage
-----

    var MakeMerch = require('makemerch');
    var request = require('request');

    var makeMerch = MakeMerch({
      wordnikAPIKey: '<your key here>',
      request: request
    });

    makeMerch(3, logItems);

    function logItems(error, items) {
      if (error) {
        console.log(error);
      }
      else {
        console.log(JSON.stringify(items, null, '  '));
      }
    }

Output:

    [
      {
        "id": "ihVeegggb",
        "thing": "attendees",
        "adjective": "chewy",
        "postfixAdjective": false,
        "cost": "15.00"
      },
      {
        "id": "ijJIJeaSy",
        "thing": "entrées",
        "adjective": "inflatable",
        "postfixAdjective": false,
        "quantity": 31,
        "units": "six-packs",
        "cost": "527.00"
      },
      {
        "id": "iqvNWqswV",
        "thing": "yogis",
        "cost": "64.00"
      }
    ]

The functor, `MakeMerch`, requires an opts object with a `wordnikAPIKey` whose value is your [Wordnik API key](http://developer.wordnik.com/) and a `request` function, which can be from the [request](https://github.com/request/request) module or anything that behaves like it and make http requests.

The function that it generates, `makeMerch` takes the number of items to be generated and a callback which will be passed the error and the items.

Tests
-----

Run tests with `make test`.

License
-------

The MIT License (MIT)

Copyright (c) 2016 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
