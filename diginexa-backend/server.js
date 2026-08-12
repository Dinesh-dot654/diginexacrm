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

// 1. ADD EMPLOYEE (POST)
app.post('/add-employee', async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.status(201).json({ message: "Employee added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. GET EMPLOYEES (GET)
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. DELETE EMPLOYEE (DELETE)
app.delete('/api/employees/:empId', async (req, res) => {
    try {
        await Employee.findOneAndDelete({ empId: req.params.empId });
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. LOGIN CHECK (POST) - Ithu thaan ippo miss aachu!
app.post('/api/login', async (req, res) => {
    try {
        const { officeId, password } = req.body;

        // Database-la antha ID & Password vachi employee irukkangala nu thedurom
        const employee = await Employee.findOne({ empId: officeId, password: password });
        
        if (employee) {
            // Employee match aagitaa, success nu anuppurom
            res.status(200).json({ 
                success: true, 
                user: { role: 'employee', fullName: employee.name, empId: employee.empId } 
            });
        } else {
            // Match aagalana error message
            res.status(401).json({ success: false, message: 'Invalid Office ID or Password! Access Denied.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});