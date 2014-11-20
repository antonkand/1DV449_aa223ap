# social-media-login

Module for easy login using OAuth2. 

## Requirements 

social-media-login runs on Express.js and uses Jade for templating.

## Usage

### 1. Clone the module into your lib
```bash
cd /lib
git clone https://github.com/antonkandersson/social-media-login.git
```

### 2. Include social-media-login in your Jade template
```jade
// in main.jade
// include your template for login,
// social-media-login.jade will be inserted into /your-specified-viewfolder/partials
body.container-fluid.text-center
    div.row
        include social-media-login

    footer.col-md-4
        include footer
```

### 3. Initialize the module
```javascript
/*
* social-media-login takes an Express app,
* a route on which the login should appear,
* the route to redirect to after successful login,
* a view to render for the login form
* a view to render after successful login
* @param {function} app Express app to use
* @param {string} route The route to use for login form, passed in as '/routename' (optional, defaults to '/login')
* @param {string} view The view to render before user has logged in (optional, defaults to 'login')
* @param {string} loggedInRoute The route to use when user logs in, as '/routename' (optional, defaults to '/logged-in')
* @param {string} loggedInView The view to render when logged in (optional, defaults to 'logged-in')
* @param {string} viewsFolder The Express apps views (optional, defaults to '/views')
* */

// All views are jade-templates
// if you're into MVC
var express = require('express');
var app = express();
var LoginController = require('./lib/login');
LoginController(app, '/login', 'main', '/logged-in', 'logged-in');

// or if you'd just like it to be called routes
var express = require('express');
var app = express();
var login = require('./lib/login');
login(app, '/login', 'main', '/logged-in', 'logged-in');

## Caveat

The module merges it's views with the passed in Express-app. The default template for login is named `social-media-login.jade`. You should not have a template named `social-media-login` for other purposes.

