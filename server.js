const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

app.use(function middleware(req, res, next) {
console.log(req.method + ' ' + req.path + ' - ' + req.ip)
next();
});

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

var newUser = new mongoose.Schema({
    "new_user": String,
    "Id": String,
    "log" : [{ description: String, duration: Number, date: Date }]
});

var createNewUser = mongoose.model("createNewUser", newUser);


app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/exercise/new-user', function(req, res,next){
const username = req.body.username;
//const userId = generateUniqueId(7);   
  createNewUser.findOne({ "new_user": username}, function (err, datauser) {
//check if username exists first
        if (datauser) {
            res.send("This username is already taken")
        } else {
            var userId = GenerateUniqueId(7);
//saving username and id in db in order to be able to get it after          
            const newUsernameAndId = new createNewUser({
              "new_user": username,
              "Id": userId
            });

            newUsernameAndId.save();

    res.json({"new_user": username, "Id": userId});
        }
        });
});

//generate unique  Id
function GenerateUniqueId(lengthOfId) {
   var newId  = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      newId += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return newId;
};


app.post('/api/exercise/add', function(req,res){
const userId = req.body.userId;
const description = req.body.description;
const duration = req.body.duration;
const date = req.body.date;
const requiredFieldsToComplete = userId && description && duration;

if(requiredFieldsToComplete == null){
  res.send("Please complere required fields");
} else{
createNewUser.findById(userId, function(error, user){
if(user){

}
});

}



});





// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


