import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'; // Environment variables-ah read panna ithu thevai
import Employee from './Employee.js'; 

// .env config setup
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Direct link-kku bathila Render-la set panna variable-ah edukkurom
const dbURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});