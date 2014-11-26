'use strict';
var submit = document.querySelector('#submitButton');
var chatbox = document.querySelector('#chatbox');
var body = document.body;
var messageboard = document.querySelector('#messageboard');
var userEmail = document.querySelector('#userEmail');

// Checks the variable by calling toString.
// Comparison passed in should be in format '[object TypeOfObject]'.
// Ie: checkObject('string', '[object String]');
function checkObject (variable, comparison) {
    return Object.prototype.toString.call(variable) === comparison;
};

function isString (variable) {
    return checkObject(variable, '[object String]');
};

function Message (str, user) {
    // TODO: add sanitize to str
    console.log(str + user);
    if (isString(str) && isString(user)) {
        return {
            message: str,
            user: user,
            date: Date()
        };
    }
    else {
        throw new Error('Message: failed to create new Message.');
    }
};
function insertMessage (message, email) {
    var msg = new Message(message, email);
// message container
    var div = document.createElement('div');
// user info
    var userParagraph = document.createElement('p');
    userParagraph.textContent = '@' + msg.user + ' wrote:';
// date info
    var timeParagraph = document.createElement('p');
    timeParagraph.textContent = msg.date;
    var small = document.createElement('small');
    small.appendChild(timeParagraph);
// main message
    var blockquote = document.createElement('blockquote');
    blockquote.textContent = msg.message;
// 1. date, 2. username, 3. message
    div.appendChild(small);
    div.appendChild(userParagraph);
    div.appendChild(blockquote);
    messageboard.appendChild(div);
};


body.addEventListener('keydown', function (e) {
    e = e || event;
    if (e.target === chatbox && e.keyCode === 13) {
        if (!chatbox.value === null) {
            e.preventDefault();
            return;
        }
        // TODO: easy shift-enter and br replacement
        chatbox.value.replace(/\n/g, '<br>');
        e.preventDefault();
        console.log(chatbox.value, userEmail.value);
        insertMessage(chatbox.value, userEmail.value);
    }
}, false);
body.addEventListener('click', function (e) {
    e = e || event;
    if (e.target === submit) {
        e.preventDefault();
        console.log(chatbox.value, userEmail.value);
        insertMessage(chatbox.value, userEmail.value);
    }
});

if (window.WebSocket) {
    //var marmottajax=function(e){return marmottajax.get(e)};marmottajax.normalize=function(e){return e?typeof e==="string"?{url:e}:e:false};marmottajax.json=function(e){if(e=marmottajax.normalize(e)){e.json=true;return new marmottajax.request(e)}};marmottajax.get=function(e){return new marmottajax.request(e)};marmottajax.post=function(e){if(e=marmottajax.normalize(e)){e.method="POST";return new marmottajax.request(e)}};marmottajax.put=function(e){if(e=marmottajax.normalize(e)){e.method="PUT";return new marmottajax.request(e)}};marmottajax.delete=function(e){if(e=marmottajax.normalize(e)){e.method="DELETE";return new marmottajax.request(e)}};marmottajax.request=function(e){if(!e){return false}if(typeof e=="string"){e={url:e}}if(e.method==="POST"||e.method==="PUT"||e.method=="DELETE"){var t="?";for(var n in e.options){t+=e.options.hasOwnProperty(n)?"&"+n+"="+e.options[n]:""}}else{e.method="GET";e.url+=e.url.indexOf("?")<0?"?":"";for(var n in e.options){e.url+=e.options.hasOwnProperty(n)?"&"+n+"="+e.options[n]:""}}this.xhr=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");this.xhr.options=e;this.xhr.callbacks={then:[],error:[]};this.then=function(e){this.xhr.callbacks.then.push(e);return this};this.error=function(e){this.xhr.callbacks.error.push(e);return this};this.xhr.call=function(e,t){for(var n=0;n<this.callbacks[e].length;n++){if(typeof this.callbacks[e][n]==="function"){this.callbacks[e][n](t)}}};this.xhr.returnSuccess=function(e){this.call("then",e)};this.xhr.returnError=function(e){this.call("error",e)};this.xhr.onreadystatechange=function(){if(this.readyState===4&&this.status==200){var e=this.responseText;if(this.options.json){try{e=JSON.parse(e)}catch(t){this.returnError("invalid json");return false}}this.returnSuccess(e)}else if(this.readyState===4&&this.status==404){this.returnError("404")}else if(this.readyState===4){this.returnError("unknow")}};this.xhr.open(e.method,e.url,true);this.xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");this.xhr.send(typeof t!="undefined"?t:null)};

    console.log('WebSocket enabled browser.');
    //var getMessages = function () {
    //    marmottajax.get({
    //        url: '/messages',
    //        method: 'GET',
    //        json: true,
    //        options: {}
    //    }).then(function (result) {
    //        console.log(result);
    //        //getMessages();
    //    }).error(function (message) {
    //        console.log(message);
    //    });
    //};
    //var postMessage = function (message, url) {
    //  var xhr = new XMLHttpRequest();
    //  xhr.onreadystatechange = function () {
    //    if (xhr.readyState === 4) {
    //       if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
    //           console.log(xhr.responseText);
    //       }
    //        else {
    //            console.log('postMessage: unsuccessful post. status code ' + xhr.status);
    //        }
    //      }
    //  };
    //  xhr.open('post', url, true);
    //  xhr.setRequestHeader('Content-Type', '"application/json;charset=UTF-8"');
    //  xhr.send(JSON.stringify(message));
    //};
    //postMessage({message: 'hey'});
    //window.onload = getMessages();
}
else {
    console.log('No WebSocket available, using AJAX longpolling');
}

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
//    var stream = createStream('/messages', function (data) {
//        console.log('progress: ' + data);
//    }, function (end) {
//        console.log('finished: ' + end);
//    });
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