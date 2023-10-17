const express = require('express');
const mongoose =require('mongoose');
const cors = require('cors');
const app = express();
const VoteModel=require('./models/votedata');
const LoginModel=require('./models/logindata');
const RegisterModel=require('./models/Register');
const TeamModel=require('./models/teams');

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://sriram:Sri&ram2114@cluster0.oqpjd5r.mongodb.net/')

// app.post('/getdata',(req,res)=>{
//     const{rollNumber,selectedTeam,ipAddress}=req.body;
//     VoteModel.findOne({ipAddress:ipAddress})
//     .then(user=>{
//         if(user){
//             res.json('Already Voted');
//         }else{
//             VoteModel.create({rollNumber:rollNumber,selectedTeam:selectedTeam,ipAddress:ipAddress})
//             .then(result=>res.json(""))
//             .catch(err=>res.json("Error"))
//         }
//     }).catch(err=>res.json(err))
// })
app.post('/getdata', async (req, res) => {
  const { rollNumber, selectedTeam, ipAddress } = req.body;
  
  try {
    const user = await VoteModel.findOne({ ipAddress: ipAddress });

    if (user) {
      res.json("Already Voted");
    } else {
      const result = await VoteModel.create({ rollNumber, selectedTeam, ipAddress });
      res.json("");
    }
  } catch (error) {
    res.json("Error");
  }
});

app.delete("/teams/:name", async (req, res) => {
  // Get the team name from the request parameters
  const teamName = req.params.name;

  // Find the team to be deleted by name
  const team = await TeamModel.findOne({ teamname: teamName });

  // If the team is not found, return an error
  if (!team) {
    return res.status(404).json({ message: "Team not found" });
  }

  // Delete the team from the database
  await TeamModel.deleteOne({ teamname: teamName });

  // Send a response to the client
  res.status(200).json({ message: "Team deleted successfully" });
});



app.post('/register',(req,res)=>{
  RegisterModel.create(req.body)
  .then(user=>res.json(user))
  .catch(err=>res.json(err))
})
app.post('/teamadd',(req,res)=>{
  TeamModel.create(req.body)
  .then(user=>res.json(user))
  .catch(err=>res.json(err))
})
app.get('/getTeams', async (req, res) => {
  try {
    const teams = await TeamModel.find({}).exec();
    const teamNames = teams.map((team) => team.teamname);
    res.json(teamNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/login',(req,res)=>{
  const {username,password}=req.body;
  RegisterModel.findOne({username:username})
  .then(user=>{
    if(user){
      if(user.password===password){
        res.json("success")
      }else{
        res.json("Password is incorrect")
      }
    }else{
      res.json("No User Exists")
    }
  })
})


app.get('/team-vote-counts', async (req, res) => {
  try {
    // Implement the logic to get team vote counts and names from your database
    const teamCounts = await VoteModel.aggregate([
      {
        $lookup: {
          from: 'TeamModel',
          localField: 'selectedTeam',
          foreignField: '_id',
          as: 'team',
        },
      },
      {
        $group: {
          _id: '$selectedTeam',
          count: { $sum: 1 },
          team: { $first: '$team' },
        },
      },
    ]);

    res.json(teamCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




// app.post("/check", (req, res) => {
//     const { ipAddress } = req.body;
//     VoteModel.findOne({ ipAddress: ipAddress }).then((user) => {
//       if (user) {
//             res.json("Record Exists");
        
//       } else {
//         res.json("No such record exists");
//       }
//     });
//   });

app.post("/check", async (req, res) => {
  const { ipAddress } = req.body;
  
  try {
    const user = await VoteModel.findOne({ ipAddress: ipAddress });

    if (user) {
      res.json("Record Exists");
    } else {
      res.json("No such record exists");
    }
  } catch (error) {
    res.json("Error");
  }
});

    
app.listen(3001,()=>{
    console.log("Server is running");
})
