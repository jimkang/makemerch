var fallbacks = require('./fallbacks');
var units = require('./units');
var adjectives = require('./adjectives');
var iscool = require('iscool')();
var randomId = require('idmaker').randomId;
var probable = require('probable');
var SearchFlickr = require('./search-flickr');
var queue = require('d3-queue').queue;
var assign = require('lodash.assign');

function MakeMerch(createOpts) {
  var wordnikAPIKey;
  var request;
  var includeImages;
  var flickrAPIKey;

  if (createOpts) {
    wordnikAPIKey = createOpts.wordnikAPIKey;
    request = createOpts.request;
    includeImages = createOpts.includeImages;
    flickrAPIKey = createOpts.flickrAPIKey;
  }

  if (includeImages && flickrAPIKey) {
    var searchFlickr = SearchFlickr({
      flickrAPIKey: flickrAPIKey,
      request: request
    });
  }

  var randomObjectsBaseURL = 'http://api.wordnik.com/v4/words.json/' + 
    'randomWords?hasDictionaryDef=false&includePartOfSpeech=noun&' + 
    'excludePartOfSpeech=proper-noun&minCorpusCount=500&maxCorpusCount=-1&' + 
    'minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&' + 
    'api_key=' + wordnikAPIKey;
  
  // banners: [
  //   'bonus',
  //   'gift with purchase',
  //   'sale',
  //   'limited time',
  //   'best seller',
  //   'new',
  //   'back in stock',
  //   'special edition',
  //   'reduced for quick sale',
  //   'buy 1 get 1 free',
  //   '9 for the price of 8'
  // ],
  // encouragement: [
  //   'YISS',
  //   'Yiss!',
  //   'That\'s right, son!',
  //   'wow such deal',
  //   'Do it!'
  // ],

  function makeMerch(number, done) {
    var items = []; 
    var reqOpts = {
      method: 'GET',
      url: randomObjectsBaseURL + '&limit=' + number,
      timeout: 2500,
      json: true
    };

    request(reqOpts, requestDone);

    function requestDone(error, response, wordObjects) {
      if (error) {
        console.log(error);
        for (var i = 0; i < number; ++i) {
          items.push(
            makeItem(probable.pickFromArray(fallbacks))
          );
        }
      }
      else {
        items = wordObjects.map(getWordFromObject);
      }
      if (!includeImages) {
        done(null, items);
      }
      else {
        getImagesForItems(items, done);
      }
    }
  }

  function getWordFromObject(obj) {
    var item = null;
    if (iscool(obj.word)) {
      item = makeItem(obj.word);
    }
    else {
      item = makeItem(probable.pickFromArray(fallbacks));
    }
    return item;
  }

  function makeItem(objectName) {
    var item = {
      id: 'i' + randomId(8),
      thing: objectName
    };

    var adjectiveRoll = probable.roll(5);
    if (adjectiveRoll < 3) {
      var adjective = probable.pickFromArray(adjectives);
      item.adjective = adjective;
    
      item.postfixAdjective = (adjectiveRoll > 1) ;
    }

    if (probable.roll(2) === 0) {
      item.quantity = probable.rollDie(50);
      item.units = probable.pickFromArray(units);
    }

    var theQuantity = item.quantity ? item.quantity : 1;
    var costMagnitudeRoll = probable.roll(100);
    if (costMagnitudeRoll < 70) {
      item.cost = (probable.rollDie(30) * theQuantity).toFixed(2);
    }
    else if (costMagnitudeRoll < 90) {
      item.cost = ((probable.roll(70) + 30) * theQuantity).toFixed(2);
    }
    else if (costMagnitudeRoll < 99) {
      item.cost = ((probable.roll(400) + 100) * theQuantity).toFixed(2);
    }
    else {
      item.cost = ((probable.roll(9500) + 500) * theQuantity).toFixed(2);
    }  
    return item;
  }

  function getImagesForItems(items, done) {
    var q = queue();
    items.forEach(addItemToQueue);
    q.awaitAll(passItems);

    function addItemToQueue(item) {
      q.defer(searchFlickr, item.thing);
    }

    function passItems(error, results) {
      if (error) {
        done(error);
      }
      else {
        for (var i = 0; i < results.length; ++i) {
          items[i] = assign(items[i], results[i]);
        }
        done(null, items);
      }
    }
  }

  return makeMerch;
}

module.exports = MakeMerch;
