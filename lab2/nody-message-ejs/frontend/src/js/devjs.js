'use strict';
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

var MessageBoard = {
    helpers: {
        checkObject:
        // Checks the variable by calling toString.
        // Comparison passed in should be in format '[object TypeOfObject]'.
        // Ie: checkObject('string', '[object String]');
            function (variable, comparison) {
                return Object.prototype.toString.call(variable) === comparison;
            },
        isString: function (variable) {
            return MessageBoard.helpers.checkObject(variable, '[object String]');
        },
        Message: function (str, user, date) {
            //console.log('Message:')
            //console.log(str);
            //console.log(user);
            //console.log(date);
            date = date || new Date();
            // TODO: parse date to nicely looking timestamp
            if (MessageBoard.helpers.isString(str) && MessageBoard.helpers.isString(user)) {
                return {
                    message: str,
                    user: user,
                    date: date
                };
            }
            else {
                throw new Error('Message: failed to create new Message.');
            }
        },
        insertMessage: function (message, email, date) {
            //console.log('insertMessage');
            //console.log('message, email, date');
            //console.log(message +' '+ email + ' '+ date);
            var msg = new MessageBoard.helpers.Message(message, email, date);
            // message container
            var div = document.createElement('div');
            // user info
            var userParagraph = document.createElement('p');
            userParagraph.textContent = 'by ' + msg.user;
            var strong = document.createElement('strong');
            strong.appendChild(userParagraph);
            // date info
            var timeParagraph = document.createElement('p');
            timeParagraph.textContent = msg.date;
            timeParagraph.setAttribute('class', 'small');
            var small = document.createElement('small');
            small.appendChild(strong);
            small.appendChild(timeParagraph);
            // main message
            var blockquote = document.createElement('blockquote');
            blockquote.textContent = msg.message;
            blockquote.appendChild(small);
            div.appendChild(blockquote);
            if (messageboard.hasChildNodes()) {
                var firstChild = messageboard.firstChild;
                messageboard.insertBefore(blockquote, firstChild);
            }
            else {
                messageboard.appendChild(div);
            }
        }
    },
    dataTransport: {
        xhrStream: function (progressCallback, finishedCallback) {
            //console.log('xhrStream');
            NodyAjax.get(progressCallback, finishedCallback);
        },
        SSE: function () {
            console.log('SSE enabled browser.');
            var sseStream = new EventSource('/stream');
            sseStream.onmessage = function (event) {
                console.log('PING! SSE event!');
                MessageBoard.parseMessage(event.data);
            };
        }
    },
    parseMessage: function (msgs) {
        // XHR Stream sends as array
        if (msgs instanceof Array) {
            //console.log('typeof msgs, array');
            msgs.forEach(function (element) {
                //console.log(element);
                var msg = element.message;
                var user = element.user;
                var date = element.date;
                MessageBoard.helpers.insertMessage(msg, user, date);
            });
        }
        // SSE transport sends each msg as separate object
        else {
            //console.log('typeof msgs, !array');
            var msg = msgs;
            if (typeof msg === 'string') {
                msg = JSON.parse(msgs);
            }
            //console.log('parseMessage msgs');
            //console.log(typeof msg);
            MessageBoard.helpers.insertMessage(msg.message, msg.user, msg.date);
        }

    },
    handleDOM: function () {
        var submit = document.querySelector('#submitButton');
        var chatbox = document.querySelector('#chatbox');
        var body = document.body;
        var messageboard = document.querySelector('#messageboard');
        var userEmail = document.querySelector('#userEmail').textContent;
        body.addEventListener('keydown', function (e) {
            e = e || event;
            if (e.target === chatbox && e.keyCode === 13) {
                if (!chatbox.value) {
                    e.preventDefault();
                    return;
                }
                // TODO: easy shift-enter and br replacement
                chatbox.value.replace(/\n/g, '<br>');
                NodyAjax.post(chatbox.value, userEmail, '/messages', MessageBoard.parseMessage);
                e.preventDefault();
                chatbox.value = '';
            }
        }, false);
        body.addEventListener('click', function (e) {
            e = e || event;
            if (e.target === submit) {
                e.preventDefault();
                NodyAjax.post(chatbox.value, userEmail, '/messages', MessageBoard.parseMessage);
                chatbox.value = '';
            }
        });
    },
    init: function () {
        MessageBoard.handleDOM();
        if (window.EventSource) {
            var progress = function (data) {
                //console.log('poll progress: data received.');
                JSON.parse(data).forEach(function (element) {
                        MessageBoard.parseMessage(element)}
                );
            };
            var finished = function (data) {
                //console.log('poll end: stream ended.');
                MessageBoard.dataTransport.xhrStream(progress, finished);
            };
            var allMessagesLoaded = function (data) {
                MessageBoard.dataTransport.xhrStream(progress, finished);
                JSON.parse(data).forEach(function (element) {
                        MessageBoard.parseMessage(element)}
                );
            };
            NodyAjax.allMessages('/allmessages', allMessagesLoaded);
            NodyAjax.experiment();
        }
        else {
            MessageBoard.dataTransport.SSE();
        }
    }
};

window.onload = MessageBoard.init;