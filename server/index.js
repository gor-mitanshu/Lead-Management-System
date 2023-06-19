const express = require("express");
const app = express();
const colors = require("colors");
require('dotenv').config();
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generatePassword = require('@wcj/generate-password');
const User = require('./models/UserSchema');
const Lead = require('./models/LeadSchema');

mongoose.connect(process.env.MONGO_URL).then(e => {
    console.log("Connection Established".bgGreen.white)
}).catch(err => {
    console.error(err)
})
// PORT
const PORT = process.env.PORT || 8080;
// Listen Port
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`.bgWhite.white);
})
// Admin Register 
app.post('/api/adminregister', async (req, res) => {
    try {
        let existingadmin = await User.findOne({ email: req.body.email });
        if (!!existingadmin) {
            return res.status(409).send({
                success: false,
                message: "Admin Already Registered!"
            })
        } else {
            const admin = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                password: await bcrypt.hash(req.body.password, 10),
                key: req.body.key,
                role: "admin",
            })
            await admin.save();
            return res.status(200).send({
                success: true,
                message: "Successfully Registered",
                admin: admin
            })
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Error in Registration",
            error
        })
    }
})
// Admin Login
app.post('/api/login', async (req, res) => {
    try {
        const admin = await User.findOne({ email: req.body.email });
        if (!!admin) {
            const hashedPassword = await bcrypt.compare(req.body.password, admin.password);
            const token = jwt.sign({ admin }, "auth",);
            if (!!hashedPassword) {
                return res.status(200).send({
                    success: true,
                    message: "Login Successful",
                    result: { token }
                })
            } else {
                return res.status(401).send({
                    success: false,
                    message: "Password does not match"
                })
            }
        } else {
            return res.status(400).send({
                success: false,
                message: "Email is not Registered",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
})
// Forget Password
app.post('/api/forgetpassword', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email, key: req.body.key });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email Or Answer",
            });
        } else {
            await User.findByIdAndUpdate(user._id, { password: await bcrypt.hash(req.body.password, 10), });
            return res.status(200).send({
                success: true,
                message: "Password Reset Successfully"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
})
// PROFILE SECTION
// Admin Profile
app.get("/api/profile", async (req, res) => {
    try {
        const token = req.headers.authorization;
        const data = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const admin = await User.findOne({ _id: data.admin._id });
        if (!!admin) {
            if (!!data) {
                return res.status(200).send({
                    success: true,
                    message: "Success",
                    data: admin
                })
            } else {
                return res.status(401).send({
                    success: false,
                    message: "Data Not Found"
                })
            }
        } else {
            return res.status(400).send({
                success: false,
                message: "No Data Found",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
})
// Edit Profile
app.put('/api/editprofile/:id', async (req, res) => {
    try {
        const result = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, phone: req.body.phone } }, { new: true }
        )
        if (!!result) {
            return res.status(200).send({
                success: true,
                message: "Updated Successfully",
                data: result
            })
        } else {
            return res.status(400).send({
                success: false,
                message: "Error Updating"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
})
// EMPLOYEE SECTION 
// Add Employee
app.post('/api/addemployees', async (req, res) => {
    try {
        let existingemployee = await User.findOne({ email: req.body.email });
        if (!!existingemployee) {
            return res.status(409).send({
                success: false,
                message: "Employee Already Added!"
            })
        } else {
            const hashpassword = generatePassword.generate({
                length: 10,
                numbers: true,
                symbols: true,
                uppercase: true,
                lowercase: true,
                excludeSimilarCharacters: false,
                exclude: '"`\\',
            })
            const employee = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                password: await bcrypt.hash(hashpassword, 10),
                role: "employee",
            })
            await employee.save()
            return res.status(200).send({
                success: true,
                message: "Employee Added Successfully",
                data: employee
            })
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
})
// GET ALL Employee
app.get('/api/getemployees', async (req, res) => {
    try {
        const getallemployee = await User.find({ role: 'employee' })
        if (getallemployee) {
            return res.status(200).send({
                success: true,
                message: "Success",
                data: getallemployee
            })
        } else {
            return res.status(400).send({
                success: false,
                message: "Data Not Found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Some Error Occured",
            error
        })
    }
})
// Delete Employee
app.delete('/api/deleteemployee/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deleteEmp = await User.findByIdAndDelete({ _id: id })
        if (!!deleteEmp) {
            return res.status(200).send({
                success: true,
                message: "Employee Deleted Successfully",
            })
        } else {
            return res.status(404).send({
                success: false,
                message: "Error Deleting Employee"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
})
// GET employee from id
app.get('/api/getemployee/:id', async (req, res) => {
    try {
        const { id } = req.params
        const updatedEmp = await User.findById({ _id: id })
        if (!!updatedEmp) {
            return res.status(200).send({
                success: true,
                message: "Success",
                data: updatedEmp
            })
        } else {
            return res.status(404).send({
                success: false,
                message: "Error getting employee"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Some Error Occured",
            error
        })
    }
})
// Edit Employee
app.put("/api/editemployee/:id", async (req, res) => {
    try {
        const updateEmp = await User.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: await bcrypt.hash(req.body.password, 10)
                }
            },
            { new: true }
        )
        if (!!updateEmp) {
            res.status(200).send({
                success: true,
                message: "Employee Updated Successfully",
                data: updateEmp
            })
        } else {
            res.status(400).send({
                success: false,
                message: "Error Updating Employee"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
})
// Lead SECTION
// Add Lead
app.post('/api/addlead', async (req, res) => {
    try {
        const findemployee = await User.findById({ _id: req.body.assign })
        const lead = new Lead({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            company: req.body.company,
            enquiry: req.body.enquiry,
            assign: req.body.assign,
            employeename: findemployee.firstname + " " + findemployee.lastname,
            status: "PENDING",
        })
        await lead.save()
        return res.status(200).json({
            success: true,
            message: "Lead Added Successfully",
            data: lead
        })
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
})
//GET All Enquiries
app.get('/api/getleads', async (req, res) => {
    try {
        const leads = await Lead.find()
        if (!!leads) {
            return res.status(200).send({
                success: true,
                message: "Success",
                data: leads
            })
        } else {
            return res.status(400).send({
                success: false,
                message: "Data Not Found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
})
// GET single enquiry from id
app.get('/api/lead/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await Lead.findById({ _id: id });
        if (!!lead) {
            return res.status(200).send({
                success: true,
                message: "Success",
                data: lead
            })
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
})
// Edit Lead
app.put("/api/updatelead/:id", async (req, res) => {
    try {
        const employeeename = await User.find({ _id: req.body.assign })
        const updateLead = await Lead.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    phone: req.body.phone,
                    company: req.body.company,
                    enquiry: req.body.enquiry,
                    assign: req.body.assign,
                    employeename: employeeename[0].firstname + " " + employeeename[0].lastname,
                    status: req.body.status
                }
            },
            { new: true }
        )
        if (!!updateLead) {
            res.status(200).send({
                success: true,
                message: "Lead Updated Successfully",
                data: updateLead
            })
        } else {
            res.status(404).send({
                success: false,
                message: "Error Fetching Lead",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
})
//view
app.get('/getlead-details/:id', async (req, res) => {
    try {
        const { id } = req.params
        const ViewLead = await Lead.findById({ _id: id })
        if (ViewLead) {

            return res.status(200).send({
                success: true,
                message: "Success",
                data: ViewLead
            })
        } else {
            res.status(400).send({
                success: false,
                message: "Error Fetching Data",
            })
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
})
// Delete Lead
app.delete('/api/deletelead/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deleteLead = await Lead.findByIdAndDelete({ _id: id });
        if (!!deleteLead) {
            return res.status(200).send({
                success: true,
                message: " Lead Deleted Successfully"
            })
        } else {
            res.status(400).send({
                success: false,
                message: "Error Deleting",
                error
            })
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
})
// Get enquiry by employee id
app.get('/getemplead/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const getempenq = await Lead.find({ assign: id });
        if (getempenq) {
            return res.status(200).send({
                success: true, message: "Success",
                data: getempenq
            })
        }
    } catch (error) {
        res.status(404).send({
            success: false,
            message: "Some Error Occured",
            error
        })
    }
})
// Change Password
app.put('/api/changepassword/:id', async (req, res) => {
    try {
        const password = await bcrypt.hash(req.body.password, 10);
        const result = await User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { password: password, } },
            { new: true }
        )
        if (!!result) {
            return res.status(200).send({
                success: true,
                message: "Update Password Successfully",
            });
        } else {
            return
        }
    } catch (error) {
        res.status(404).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
})