var test = require('tape');
var MakeMerch = require('../index');
var config = require('./config');
var request = require('request');

test('Basic test', function basicTest(t) {
  var makeMerch = MakeMerch({
    wordnikAPIKey: config.wordnikAPIKey,
    request: request
  });

  makeMerch(10, checkItems);

  function checkItems(error, items) {
    t.ok(!error, 'No error while making merch.');
    t.equal(items.length, 10, 'Created 10 items.');
    items.forEach(checkItem);

    function checkItem(item) {
      t.ok(item.id.length > 0, 'Item has an id.');
      t.ok(item.thing.length > 0, 'Item has a thing.');
      t.ok(item.cost.length > 0, 'Item has a cost.');
    }

    // console.log(JSON.stringify(items, null, '  '));
    t.end();
  }
});

test('Image test', function imageTest(t) {
  var makeMerch = MakeMerch({
    wordnikAPIKey: config.wordnikAPIKey,
    flickrAPIKey: config.flickrAPIKey,
    request: request,
    includeImages: true
  });

  makeMerch(5, checkItems);

  function checkItems(error, items) {
    t.ok(!error, 'No error while making merch.');
    t.equal(items.length, 5, 'Created 5 items.');
    items.forEach(checkItem);

    function checkItem(item) {
      t.ok(item.id.length > 0, 'Item has an id.');
      t.ok(item.thing.length > 0, 'Item has a thing.');
      t.ok(item.cost.length > 0, 'Item has a cost.');
      t.ok(item.imageURL.length > 0, 'Item has an imageURL.');
    }
    
    // console.log(JSON.stringify(items, null, '  '));
    t.end();
  }
});
