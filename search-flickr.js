var probable = require('probable');

function SearchFlickr(createOpts, done) {
  var flickrAPIKey;
  var request;

  if (createOpts) {
    flickrAPIKey = createOpts.flickrAPIKey;
    request = createOpts.request;    
  }

  function searchFlickr(term, done) {
    var reqOpts = {
      method: 'GET',
      url: getFlickrSearchURL(term),
      timeout: 30000,
      json: true
    };

    var result = {};

    request(reqOpts, searchDone);

    function searchDone(error, httpResponse, searchResponse) {
      if (error) {
        done(error);
      }
      else if (searchResponse.stat !== 'ok' || searchResponse.photos.photo.length < 1) {
        done(new Error('Couldn\'t find image. Status:', searchResponse.stat));
      }
      else {
        var photoObj = probable.pickFromArray(searchResponse.photos.photo);
        // Filter out "Bristol Street Directory" spam.
        // TODO: Prefilter instead of picking, then rejecting.
        if (photoObj.title.indexOf('Bristol Street') !== -1) {
          done(new Error('Filtered spam image.'));
        }
        else {
          result.imageAttribution = 'http://www.flickr.com/photos/' + 
            photoObj.owner + '/' + photoObj.id;
          
          var sizeReqOpts = {
            method: 'GET',
            url: getFlickrGetSizesURL(photoObj.id),
            timeout: 30000,
            json: true
          };
          request(sizeReqOpts, sizesGot);
        }
      }
    }

    function sizesGot(error, httpResponse, sizesResponse) {
      if (error) {
        done(error);
      }
      else if (sizesResponse.stat !== 'ok') {
        done(new Error('Couldn\'t get image. Status: ' + sizesResponse.stat));
      }
      else {
        // The second element should be the "Square 150" size.
        var squareSize = sizesResponse.sizes.size[1];
        result.imageURL = squareSize.source;
        done(null, result);
      }
    }
  }

  function getFlickrSearchURL(text) {
    return 'https://api.flickr.com/services/rest/?' + 
      'method=flickr.photos.search&' + 
      'api_key=' + flickrAPIKey + '&' + 
      'text=' + text + '&' +
      'license=1%2C2%2C3%2C4%2C5%2C6%2C7%2C8&per_page=3&' + 
      'format=json&nojsoncallback=1&';
  }

  function getFlickrGetSizesURL(photoId) {
    return 'https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&' +
      'api_key=' + flickrAPIKey + '&' + 
      'photo_id=' + photoId + '&' +
      'format=json&nojsoncallback=1';
  }

  return searchFlickr;
}

module.exports = SearchFlickr;
