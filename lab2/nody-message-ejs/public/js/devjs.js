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
                    date: date.toLocaleTimeString() + ' ' + date.toDateString()
                };
            }
            else {
                throw new Error('Message: failed to create new Message.');
            }
        },
        insertMessage: function (message, email, date) {
            console.log('insertMessage');
            console.log(message, email);
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
    init: function () {
        var messages = [];

        var parseMessage = function (message) {
            console.log('parseMessages');
            Object.keys(JSON.parse(messages)).forEach(function (element) {
                console.log(messages[element]);
                MessageBoard.helpers.insertMessage(messages[element].message, messages[element].user, messages[element].date);
            });
        };
        var populateArray = function () {
            NodyAjax.get(function (data, parseMessage) {
                console.log('progress: data received.');
                console.log(data);
                messages.push(data);
                parseMessage(data);
            }, function (data) {
                console.log('end: stream ended.');
                console.log(data);
            }
        )}();
        console.log(messages);
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
                console.log(chatbox.value);
                console.log(userEmail);
                // TODO: easy shift-enter and br replacement
                chatbox.value.replace(/\n/g, '<br>');
                e.preventDefault();
                NodyAjax.post(chatbox.value, userEmail, '/messages');
                MessageBoard.helpers.insertMessage(chatbox.value, userEmail);
                chatbox.value = '';
            }
        }, false);
        body.addEventListener('click', function (e) {
            e = e || event;
            if (e.target === submit) {
                console.log(chatbox.value, userEmail.value);
                e.preventDefault();
                MessageBoard.helpers.insertMessage(chatbox.value, userEmail);
            }
        });
    }
};

window.onload = MessageBoard.init;