var NodyAjax = {
  send: function () {},
  receive: function () {},
  post: function (message, username, url) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                  console.log(xhr.responseText);
              }
              else {
                  console.log('postMessage: unsuccessful post. status code ' + xhr.status);
              }
          }
      };
      xhr.open('post', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      var msg = { message: message, user: username, date: new Date()};
      xhr.send(JSON.stringify(msg));
  },
  get: function (progressCallback, finishedCallback) {
            function createStream (url, progress, finished) {
                  var xhr = new XMLHttpRequest(),
                      received = 0;
                  xhr.open('get', url, true);
                  xhr.onreadystatechange = function () {
                      var result = null;
                      if (xhr.readyState === 3) {
                          result = xhr.responseText.substring(received);
                          received += result.length;
                          progress(result);
                      }
                      else {
                          if (xhr.readyState === 4) {
                              finished(xhr.responseText);
                          }
                      }
                  };
                  xhr.send(null);
                  return xhr;
      };
      createStream('/messages', progressCallback, finishedCallback);
  }
};
//    var crossbrowserXHR = function() {
//        var xhr = null;
//        try {
//            xhr = new XMLHttpRequest();
//        }
//        catch (error) {
//            try {
//                xhr = new ActiveXObject('Microsoft.XMLHTTP');
//            }
//            catch (error) {
//                throw new Error('crossbrowserXHR: Failed to create XHR.');
//            }
//        }
//        console.log(xhr);
//        return xhr;
//    };
//    createStream = function  (url, progress, finished) {
//        var xhr = new crossbrowserXHR(),
//            received = 0;
//        console.log(xhr);
//        xhr.open('get', url, true);
//        xhr.onreadystatechange = function () {
//            var result = null;
//            if (xhr.readyState === 3) {
//              result = xhr.responseText.substring(received);
//              received += result.length;
//              progress(result);
//            }
//            else {
//                if (xhr.readyState === 4) {
//                    finished(xhr.responseText);
//                }
//            }
//        };
//        xhr.send(null);
//        return xhr;
//    };
//
//    var postMessage = function (message, url) {
//      var xhr = crossbrowserXHR();
//      xhr.onreadystatechange = function () {
//        if (xhr.readyState === 4) {
//           if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
//               console.log(xhr.responseText);
//           }
//            else {
//                console.log('postMessage: unsuccessful post. status code ' + xhr.status);
//            }
//          }
//      };
//        xhr.open('post', url, true);
//        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//        xhr.send(message);
//    };
