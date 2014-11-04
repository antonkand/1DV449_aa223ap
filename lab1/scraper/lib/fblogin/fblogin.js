'use strict';
exports.login = function(email, password){
  return function(nightmare) {
    nightmare
      .viewport(800, 1600)
      .goto('https://facebook.com')
		  .type('#email', email)
		  .type('#pass', password)
		  .click('#loginbutton')
      .wait();
  };
};
