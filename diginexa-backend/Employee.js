import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    empId: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true }
});

const Employee = mongoose.model('Employee', EmployeeSchema);

export default Employee;