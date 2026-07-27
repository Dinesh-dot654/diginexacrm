import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Employee from './Employee.js'; 

const app = express();
app.use(cors());
app.use(express.json());

// Unga pudhu password 'dinesh123' theliva inga update panniyachu
const dbURI = "mongodb://dineshadaikkappan85_db_user:dinesh123@ac-um52mwv-shard-00-00.iczyidp.mongodb.net:27017,ac-um52mwv-shard-00-01.iczyidp.mongodb.net:27017,ac-um52mwv-shard-00-02.iczyidp.mongodb.net:27017/DiginexaCRM?ssl=true&replicaSet=atlas-sh4lq7-shard-0&authSource=admin&appName=robotriqDB";

// IPv6 / Network block thadukka { family: 4 } potirukken
mongoose.connect(dbURI, { family: 4 })
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.log("Connection Error:", err));

app.post('/add-employee', async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.status(201).json({ message: "Employee added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});