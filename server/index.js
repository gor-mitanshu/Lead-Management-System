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
const Client = require('./models/ClientSchema');
const Enquiry = require('./models/EnquirySchema');

mongoose.connect(process.env.MONGO_URL).then(e => {
    console.log("Connection Established".bgGreen.white)
}).catch(err => {
    console.error(err)
})

// Admin Register 
app.post('/api/adminregister', async (req, res) => {
    try {
        let existingadmin = await User.findOne({ email: req.body.email });
        if (!!existingadmin) {
            return res.status(409).send({
                success: false,
                error: "Already Registered!"
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
            message: "Error in Login",
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
                message: "Admin Not Found",
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
            return res.status(200).send({ success: true, message: "Updated Successfully", data: result })
        } else {
            return res.status(400).send({ success: false, message: "Error Updating" })
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

// CLIENT SECTION
// Add Client
app.post('/api/addclient', async (req, res) => {
    try {
        let existingclient = await Client.findOne({ email: req.body.email });
        if (!!existingclient) {
            return res.status(409).send({
                success: false,
                error: "Already Added!"
            })
        } else {
            const findemployee = await User.findById({ _id: req.body.assign })
            const client = new Client({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                assign: req.body.assign,
                employeename: findemployee.firstname + " " + findemployee.lastname
            })
            await client.save()
            return res.status(200).send({
                success: true,
                message: "Added Successfully",
                client: client
            })
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Error in Adding",
            error
        })
    }
})

// GET all Client 
app.get('/api/getclients', async (req, res) => {
    try {
        const getclients = await Client.find({})
        if (!!getclients) {
            return res.status(200).send({
                success: true,
                message: "Success",
                data: getclients
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

// GET single client from ID
app.get('/api/geteditclient/:id', async (req, res) => {
    try {
        const { id } = req.params
        const getupdateclient = await Client.findById({ _id: id })
        if (!!getupdateclient) {
            return res.status(200).send({
                success: true,
                message: "Success",
                data: getupdateclient
            })
        } else {
            return res.status(400).send({
                success: false,
                message: "Error Getting Client",
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

// Edit Client
app.put('/api/updateclient/:id', async (req, res) => {
    try {
        const employeeename = await User.find({ _id: req.body.assign })
        const updateclient = await Client.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    phone: req.body.phone,
                    assign: req.body.assign,
                    employeename: employeeename[0].firstname + " " + employeeename[0].lastname
                }
            },
            { new: true }
        );
        if (!!updateclient) {
            return res.status(200).send({
                success: true,
                message: "Updated Successfully",
                data: updateclient
            })
        } else {
            return res.status(400).send({
                success: false,
                message: "Error Updating",
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

// Delete Client
app.delete('/api/deleteclient/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deleteUser = await Client.findByIdAndDelete({ _id: id })
        if (!!deleteUser) {
            return res.status(200).send({
                success: true,
                message: "Deleted Successfully",
            })
        } else {
            return res.status(400).send({
                success: false,
                message: "Error Deleting",
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



// EMPLOYEE SECTION 
// Add Employee
app.post('/api/addemployees', async (req, res) => {
    try {
        let existingemployee = await User.findOne({ email: req.body.email });
        if (!!existingemployee) {
            return res.status(409).send({
                success: false,
                error: "Already Added!"
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
                message: "Successfully Added",
                data: employee
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
                message: "Deleted Successfully",
            })
        } else {
            return res.status(404).send({
                success: false,
                message: "Error deleting employee"
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
                message: "Employee Update Successfully",
                data: updateEmp
            })
        } else {
            res.status(400).send({
                success: false,
                message: "Error updating employee"
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

// ENQUIRY SECTION
// Add Enquiry
app.post('/api/addenquiry', async (req, res) => {
    try {
        const findemployee = await User.findById({ _id: req.body.assign })
        const enquiry = new Enquiry({
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
        await enquiry.save()
        return res.status(200).json({
            success: true,
            message: "Enquiry Added Successfully",
            data: enquiry
        })
    } catch (error) {
        console.log(error)
        res.status(404).send({
            success: false,
            message: "Some Error Occured",
            error
        })
    }
})

//GET All Enquiries
app.get('/api/getenquiries', async (req, res) => {
    try {
        const enquiries = await Enquiry.find()
        if (!!enquiries) {
            return res.status(200).send({
                success: true,
                message: "Success",
                data: enquiries
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

// GET single enquiry from id
app.get('/api/enquiry/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const enquiry = await Enquiry.findById({ _id: id });
        if (!!enquiry) {
            return res.status(200).send({
                success: true,
                message: "Success",
                data: enquiry
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

// Edit Enquiry
app.put("/api/updateenquiry/:id", async (req, res) => {
    try {
        const employeeename = await User.find({ _id: req.body.assign })
        const updateEnquiry = await Enquiry.findByIdAndUpdate(
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
        if (!!updateEnquiry) {
            res.status(200).send({
                success: true,
                message: "Success",
                data: updateEnquiry
            })
        } else {
            res.status(404).send({
                success: false,
                message: "Error Fetching Data",
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

//view
app.get('/getenquirydetails/:id', async (req, res) => {
    try {
        const { id } = req.params
        const ViewEnquiry = await Enquiry.findById({ _id: id })
        if (ViewEnquiry) {

            return res.status(200).send({
                success: true,
                message: "Success",
                data: ViewEnquiry
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
            message: "Some Error Occured",
            error
        })
    }
})

// accept status Enquiry
app.put("/api/acceptenquiry/:id", async (req, res) => {
    try {
        const updateEnquiry = await Enquiry.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    status: "COMPLETED"
                }
            },
            { new: true }
        )
        if (!!updateEnquiry) {
            res.status(200).send({
                success: true,
                message: "Success",
                data: updateEnquiry
            })
        } else {
            res.status(404).send({
                success: false,
                message: "Error Fetching Data",
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

// accept status Enquiry
app.put("/api/rejectedenquiry/:id", async (req, res) => {
    try {
        const updateEnquiry = await Enquiry.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    status: "REJECTED"
                }
            },
            { new: true }
        )
        if (!!updateEnquiry) {
            res.status(200).send({
                success: true,
                message: "Success",
                data: updateEnquiry
            })
        } else {
            res.status(404).send({
                success: false,
                message: "Error Fetching Data",
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

// Delete Enquiry
app.delete('/api/deleteenquiry/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deleteEnquiry = await Enquiry.findByIdAndDelete({ _id: id });
        if (!!deleteEnquiry) {
            return res.status(200).send({
                success: true,
                message: "Deleted Successfully"
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
            message: "Some Error Occured",
            error
        })
    }
})

// Get client by employee id
app.get('/getempclient/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const getempclient = await Client.find({ assign: id });
        if (getempclient) {
            return res.status(200).send({
                success: true, message: "Success",
                data: getempclient
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

// Get client by employee id
app.get('/getempenq/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const getempenq = await Enquiry.find({ assign: id });
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

// PORT
const PORT = process.env.PORT || 8080;
// Listen Port
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`.bgWhite.white);
})