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

// ==========================================
// 1. ATTENDANCE & LEAVE DATABASE SCHEMAS
// ==========================================
const attendanceSchema = new mongoose.Schema({
    empId: String,
    empName: String,
    dateKey: String,
    dateDisplay: String,
    checkInTime: String,
    checkInTimestamp: Number,
    checkOutTime: String,
    checkOutTimestamp: Number,
    status: String,
    hoursWorked: String,
    task: String
});
const Attendance = mongoose.model('Attendance', attendanceSchema);

const leaveSchema = new mongoose.Schema({
    empId: String,
    empName: String,
    fromDate: String,
    toDate: String,
    reason: String,
    status: String,
    appliedAt: Number
});
const Leave = mongoose.model('Leave', leaveSchema);


// ==========================================
// 2. EMPLOYEE ROUTES
// ==========================================

// Add Employee
app.post('/add-employee', async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        await newEmployee.save();
        res.status(201).json({ message: "Employee added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all Employees
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Employee
app.delete('/api/employees/:empId', async (req, res) => {
    try {
        await Employee.findOneAndDelete({ empId: req.params.empId });
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ==========================================
// 3. LOGIN ROUTE
// ==========================================
app.post('/api/login', async (req, res) => {
    try {
        const { officeId, password } = req.body;
        const employee = await Employee.findOne({ empId: officeId, password: password });
        
        if (employee) {
            res.status(200).json({ 
                success: true, 
                user: { role: 'employee', fullName: employee.name, empId: employee.empId } 
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid Office ID or Password! Access Denied.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
});


// ==========================================
// 4. ATTENDANCE ROUTES
// ==========================================

// Save or Update Attendance (Check-in, Check-out, Tasks)
app.post('/api/attendance', async (req, res) => {
    try {
        const { empId, dateKey } = req.body;
        
        // Intha employee-kku innaiku attendance irukkaa nu thedurom
        let record = await Attendance.findOne({ empId: empId, dateKey: dateKey });
        
        if (record) {
            // Irunthaa update panrom (Check-out, Tasks)
            Object.assign(record, req.body);
            await record.save();
        } else {
            // Illana puthusa create panrom (Check-in)
            record = new Attendance(req.body);
            await record.save();
        }
        res.status(200).json({ message: "Attendance updated", record });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Attendance
app.get('/api/attendance', async (req, res) => {
    try {
        const records = await Attendance.find();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete All Attendance
app.delete('/api/attendance', async (req, res) => {
    try {
        await Attendance.deleteMany({});
        res.status(200).json({ message: 'All attendance records deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ==========================================
// 5. LEAVE ROUTES
// ==========================================
app.post('/api/leaves', async (req, res) => {
    try {
        const newLeave = new Leave(req.body);
        await newLeave.save();
        res.status(201).json({ message: "Leave request submitted!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});