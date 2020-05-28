var express = require('express');
var router = express.Router();
var firebaseController = require('../controllers/firebase-controller.js');


/* GET home page. */
router.get('/', async (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  let users = await firebaseController.getListAllUsers();
  console.log(req.session.user.uid);
  res.render('index', { title: 'Express', user_info: req.session.user, users });
});

/* GET home page. */
router.get('/login', async (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('login', { title: 'Login' });
});

/* GET home page. */
router.post('/save-session', async (req, res, next) => {
  console.log(req.body.user);
  req.session.user = {
    uid: req.body.user.uid,
    name: req.body.user.name,
    avatar: req.body.user.avatar
  };
  await firebaseController.insertUser(req.session.user);
  return res.status(200).json({success: true, session: 'Save session success'})
});

router.get('/set_session', (req, res) => {
  //set a object to session
  req.session.user = {
      website: 'anonystick.com',
      type: 'blog javascript',
      like: '4550'
  }

  return res.status(200).json({status: 'success'})
})

//set session
router.get('/get_session', (req, res) => {
  //check session
  if(req.session.user){
      return res.status(200).json({status: 'success', session: req.session.user})
  }
  return res.status(200).json({status: 'error', session: 'No session'})
})

//set session
router.get('/destroy_session', (req, res) => {
  //check session
  req.session = null;
  return res.status(200).json({status: 'error', session: 'Destroyed session'})
})



module.exports = router;
