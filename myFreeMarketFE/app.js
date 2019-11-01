var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require("express-session");
const uuid4 = require("uuid/v4")
var routes = require('./routes/index');

var app = express();

// view engine setup

app.use(cookieParser());

// set a cookie
// app.use(function (req, res, next) {
//   // check if client sent cookie
//   var cookie = req.cookies.sessionIDs;
//   console.log("COOKIE", cookie)
//   if (cookie === undefined)
//   {
//     const uuid = uuid4()
//     res.cookie('sessionIDs',uuid, { maxAge: 10000, httpOnly: true });
//     console.log('cookie created successfully', uuid);
//   } 
//   else
//   {
//     // yes, cookie was already present 
//     console.log('cookie exists', cookie);
//   } 
//   next(); // <-- important!
// });

app.use(session({
  genid: (req) => {
    // console.log('Inside the session middleware')
    // console.log(req.sessionID)
    return uuid4() // use UUIDs for session IDs
  },
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// /// catch 404 and forwarding to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });

// /// error handlers

// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }

// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });


module.exports = app;
