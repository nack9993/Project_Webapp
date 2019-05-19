var admin = require("firebase-admin");
var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://line-bot-a451a.firebaseio.com"
});

const db = admin.database();
const ref = db.ref("/");
var projectRef = ref.child("guests");

module.exports.getAllDataInDB = () => {
  return dataInDB = projectRef.once("value", (allData) => {
    data = JSON.stringify(allData);
    console.log(data);
    return data;
  })}