var NodyAjax = {
  send: function () {},
  post: function (message, username, url, callback) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                  callback(xhr.responseText);
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
      console.log('createStream: inside get');
            function createStream (url, progress, finished) {
                console.log('createStream: inside createStream');
                  var xhr = new XMLHttpRequest(),
                      received = 0;
                  xhr.open('get', url, true);
                  xhr.onreadystatechange = function () {
                      console.log('createStream: inside onreadyStateChange');
                      var result = null;
                      if (xhr.readyState === 3) {
                          console.log('createStream: readyState 3');
                          result = xhr.responseText.substring(received);
                          received += result.length;
                          progress(result);
                      }
                      else {
                          if (xhr.readyState === 4) {
                              console.log('createStream: readyState 4');
                              finished(xhr.responseText);
                          }
                      }
                  };
                  xhr.send(null);
                  return xhr;
      };
      createStream('/messages', progressCallback, finishedCallback);
  },
  allMessages: function (url, callback) {
      var opened = 1,
          complete = 4,
          xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
          if (xhr.readyState === opened) {
              console.log('allMessages: opened');
          }
          if (xhr.readyState === complete) {
              if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                  console.log(xhr.responseText);
                  callback(xhr.responseText);
              }
              else {
                  console.log('Error. XHR status ' + xhr.status);
              }
          }
      };
      xhr.open('get', url, true);
      xhr.send(null);
  },
  experiment: function (progressCallback, finishedCallback) {
      console.log('createStream: inside get');
      function createStream (url, progress, finished) {
          console.log('createStream: inside createStream');
          var xhr = new XMLHttpRequest(),
              received = 0;
          xhr.open('get', url, true);
          xhr.onreadystatechange = function () {
              console.log('createStream: inside onreadyStateChange');
              var result = null;
              if (xhr.readyState === 3) {
                  console.log('createStream: readyState 3');
                  result = xhr.responseText.substring(received);
                  received += result.length;
                  progress(result);
              }
              else {
                  if (xhr.readyState === 4) {
                      console.log('createStream: readyState 4');
                      finished(xhr.responseText);
                  }
              }
          };
          xhr.send(null);
          return xhr;
      };
      createStream('/experiment', progressCallback, finishedCallback);
  }
};
