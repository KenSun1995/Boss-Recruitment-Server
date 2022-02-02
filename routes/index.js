var express = require('express');
const md5 = require('blueimp-md5')
const { UserModel, ChatModel } = require('../db/models');
var router = express.Router();
const filter = { password: 0, __v: 0 } // filter return password and version number

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * register router
 */
router.post('/api/register', (req, res) => {
  const {
    username, password, type, header, position, info, company, salary
  } = req.body;
  UserModel.findOne({ username }, (error, user) => {
    if (!user) {
      new UserModel({ username, password: md5(password), type, header, position, info, company, salary })
        .save((error, doc) => {
          if (error === null) {
            //set cookie and save in browser, maxAge persist it to local
            res.cookie('userId', doc._id, { maxAge: 1000 * 60 * 60 * 24 * 7 });
            // successfully
            res.send({ code: 0, data: { username, type, _id: doc._id } });
          } else {
            res.send({ code: 2, msg: 'undefined issue' });
          }
        })
    } else {
      res.send({ code: 1, msg: 'the user exist' });
    }
  })
})

/**
 * login router
 */
router.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  UserModel.findOne({ username, password: md5(password) }, filter, (error, user) => {
    if (error === null && user) {
      //set cookie and save in browser, maxAge persist it to local
      res.cookie('userId', user._id, { maxAge: 1000 * 60 * 60 * 24 * 7 });
      res.send({ code: 0, data: user });
    } else {
      res.send({ code: 1, msg: 'Invalid username or password' });
    }
  })
})

/*
*  get all chat info list of current user
*/
router.get('/api/msglist', function (req, res) {
  // get userId from cookies
  const userId = req.cookies.userId
  // query and find all user document data
  UserModel.find(function (err, userDocs) {
    // use obj to store all user info: key is user's _id, val is name + header
    const users = {} // obj container
    userDocs.forEach(doc => {
      users[doc._id] = { username: doc.username, header: doc.header }
    })
    /*
      query userId related all chat info
      params 1: query condition
      params 2: filter condition
      params 3: callback function
    */
    ChatModel.find({ '$or': [{ from: userId }, { to: userId }] }, filter, function (err,
      chatMsgs) {
      // return data which includes all user and related chat msg info
      res.send({ code: 0, data: { users, chatMsgs } })
    })
  })
})
/*
   change msg to read already
*/
router.post('/api/readmsg', function (req, res) {
  // get from and to
  const from = req.body.from
  const to = req.cookies.userId

  console.log("from, to: ", from, to);
  /*
    update chat info in database
    params 1: query condition
    params 2: update to specify data obj
    params 3: if it updates multiple data once or not, only update one item by default
  */
  ChatModel.updateMany({ from, to, read: false }, { read: true }, function (err,
    doc) {
    console.log('/readmsg', doc)
    res.send({ code: 0, data: doc.modifiedCount }) // amount of updating
  })
})

module.exports = router;

/*
  ## register
  ## URL： localhost:4000/register
  ## request type： POST
  ## parameters:

    |parameters  |required  |type     |desc
    |username    |Y         |string   |username
    |password    |Y         |string   |password
    |type        |Y         |string   |type

  ## return sample：
    success:
        {
          "code": 0,
          "data": {
            "_id": "5ae133e621388d262c8d91a6",
            "username": "ds2",
            "type": "expert"
          }
        }
    fail:
        {
          "code": 1,
          "msg": "the user exist"
        }
  ## desc: admin is an exist user by default
*/

router.post('/api/update', (req, res) => {
  // get userId from request cookies
  const userId = req.cookies.userId;
  // if userId is null
  if (!userId) {
    return res.send({ code: 1, msg: 'please login your account firstly' });
  }
  // get submitted user data
  const user = req.body; // without _id inside it
  UserModel.findByIdAndUpdate({ _id: userId }, user, function (error, oldUser) {
    if (!oldUser) {
      // announce browser to remove useless cookie - userId
      res.clearCookie('userId');
      res.send({ code: 1, msg: 'please login your account firstly' });
    } else {
      const { _id, username, type } = oldUser;
      const data = Object.assign(user, { _id, username, type });
      res.send({ code: 0, data });
    }
  })
})

/**
 * get user info (according to cookie)
 */
router.get('/api/user', (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.send({ code: 1, msg: 'please login firstly' })
  }
  UserModel.findOne({ _id: userId }, filter, (error, user) => {
    res.send({ code: 0, data: user });
  })
})

/**
 * get user list (according to type)
 */
router.get('/api/userlist', (req, res) => {
  const { type } = req.query;
  UserModel.find({ type }, filter, (error, users) => {
    res.send({ code: 0, data: users });
  })
})