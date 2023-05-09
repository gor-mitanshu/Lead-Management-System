const mongoose = require('mongoose')

const Client = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    assign: { type: String, required: true },
    employeename: { type: String, required: true },
    role: { type: String, default: "client" }
}, { timestamps: true },
)

const model = new mongoose.model("Client", Client)
module.exports = model