var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs  = require('express-handlebars');
var Pusher = require('pusher');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  extname: '.handlebars',
  helpers: require('./helper/handlebars-helpers') //only need this
}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// parse application/x-www-form-urlencoded
// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: ['514B729F-C2CB-4C38-9086-A3E8AA771FC6'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

const pusher = new Pusher({
  appId: '1007519',
  key: 'b38e18d7edf043da795b',
  secret: '44134ac089c3eea9c6c4',
  cluster: 'ap1'
});

app.post("/pusher/auth", (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  var presenceData = {
    user_id:
      Math.random()
        .toString(36)
        .slice(2) + Date.now()
  };
  const auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});

app.use('/', indexRouter);

app.get("/post",function(req,res,next){
  console.log(req.query);
  res.send("response");
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
