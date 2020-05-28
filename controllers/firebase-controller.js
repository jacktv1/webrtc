var firebase = require("firebase-admin");

var serviceAccount = require("../serviceAccountKey.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://webrtc-e263a.firebaseio.com"
});

var database = firebase.database();

var insertUser = async (user) => {
  try {
    var usersRef = database.ref("users");
    usersRef.set(user);
  } catch (e) {
    console.log(e);
  }
}

var getListAllUsers = async (nextPageToken) => {
    try {
        let users = [];
        // List batch of users, 1000 at a time.
        let listUsersResult = await firebase.auth().listUsers(1000, nextPageToken);
        listUsersResult.users.forEach(function(userRecord) {
          let res = userRecord.toJSON();
          let user = {
              uid: res.uid,
              displayName: res.displayName,
              email: res.email,
              photoURL: res.photoURL
          }
          users.push(user);
        });
        if (listUsersResult.pageToken) {
          // List next batch of users.
          listAllUsers(listUsersResult.pageToken);
        }
        return users;
    } catch (e) {
        console.log(e);
        return [];
    }
}

module.exports = {
    getListAllUsers,
    insertUser
}