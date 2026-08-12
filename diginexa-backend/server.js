import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'; 
import Employee from './Employee.js'; 

// Environment variables setup
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Render-la set panna variables-ah edukkurom
const dbURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// IPv6 / Network block thadukka { family: 4 }
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});