const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post('/register', async (req, res, next) => {
	try{
		
		let userparams = req.body;
		userparams["password"] = await bcrypt.hash(userparams["password"], 2);
		
		let createdUser = await User.create(userparams);

		
		res.send("successfully created user " + createdUser.username);
		res.status = 200;

	}catch(error){
		console.error(error)
		next(error)
	}
});

// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app.post("/login", async (req, res, next) => {
	try{
		let userparams = req.body;
	
		let result = await User.findOne({
			where: {
				username: userparams["username"]
			}
		});
	
//		let trialword = await bcrypt.hash(userparams["password"], 2);
		
		//console.log(trialword)
		console.log(result.password);

		let trueOrNot = await bcrypt.compare( userparams.password, result.password);
			
		if(trueOrNot == true){

			res.send("successfully logged in user " + result.username);
		}else{
			res.send("incorrect username or password");
		}
	}catch(error){
		console.error(error);
		next(error);
	}
})
// we export the app, not listening in here, so that we can run tests
module.exports = app;
