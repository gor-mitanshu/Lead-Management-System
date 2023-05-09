const mongoose = require('mongoose')

const User = new mongoose.Schema({
    // id: { type: String, required: false },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    key: { type: String, required: false },
    role: { type: String }
}, { timestamps: true },
)

const model = new mongoose.model("Master-Register", User)
module.exports = model