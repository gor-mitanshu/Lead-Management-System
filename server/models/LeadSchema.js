const mongoose = require('mongoose')
const Enquiry = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    company: { type: String, required: true },
    enquiry: { type: String, required: true },
    assign: { type: String, required: true },
    employeename: { type: String, required: true },
    role: { type: String, default: 'enquiry' },
    status: { type: String, },
}, { timestamps: true })
const e_model = new mongoose.model("Enquiry", Enquiry)
module.exports = e_model