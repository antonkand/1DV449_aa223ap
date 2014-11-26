'use strict';

var MessageBoard = {
    helpers: {
        checkObject: // Checks the variable by calling toString.
        // Comparison passed in should be in format '[object TypeOfObject]'.
        // Ie: checkObject('string', '[object String]');
            function (variable, comparison) {
                return Object.prototype.toString.call(variable) === comparison;
            },
        isString: function (variable) {
            return MessageBoard.helpers.checkObject(variable, '[object String]');
        },
        Message: function (str, user, date) {
            date = date || new Date();
            // TODO: add sanitize to str
            console.log('Message:');
            console.log(str + user);
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
            console.log('insertMessage');
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
            NodyAjax.get(progressCallback, finishedCallback)
        },
        SSE: function () {
            console.log('SSE enabled browser.');
            var sseStream = new EventSource('/stream');
            sseStream.onmessage = function (event) {
                console.log('PING! SSE event!');
                var json = JSON.parse(event.data);
                MessageBoard.parseMessage(json);
            };
        }
    },
    parseMessage: function (msgs) {
        console.log('parseMessage');
        // XHR Stream sends as array
        if (msgs instanceof Array) {
            console.log('typeof msgs, array');
            msgs.forEach(function (element) {
                console.log(element);
                var msg = element.message;
                var user = element.user;
                var date = element.date;
                MessageBoard.helpers.insertMessage(msg, user, date);
            });
        }
        // SSE transport sends each msg as separate object
        else {
            console.log('typeof msgs, !array');
            MessageBoard.helpers.insertMessage(msgs.message, msgs.user, msgs.date);
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
                window.EventSource
                    ? NodyAjax.post(chatbox.value, userEmail, '/stream')
                    : NodyAjax.post(chatbox.value, userEmail, '/messages');
                e.preventDefault();
                //MessageBoard.helpers.insertMessage(chatbox.value, userEmail);
                chatbox.value = '';
            }
        }, false);
        body.addEventListener('click', function (e) {
            e = e || event;
            if (e.target === submit) {
                e.preventDefault();
                window.EventSource
                    ? NodyAjax.post(chatbox.value, userEmail, '/stream')
                    : NodyAjax.post(chatbox.value, userEmail, '/messages');
                //MessageBoard.helpers.insertMessage(chatbox.value, userEmail);
            }
        });
    },
    init: function () {
        MessageBoard.handleDOM();
        if (!window.EventSource) {
            MessageBoard.dataTransport.xhrStream(function (data) {
                console.log('poll progress: data received.');
                MessageBoard.parseMessage(data);
            }, function (data) {
                console.log('poll end: stream ended.');
                MessageBoard.dataTransport.xhrStream();
            });
        }
        else {
            MessageBoard.dataTransport.SSE();
        }
    }
};

window.onload = MessageBoard.init;