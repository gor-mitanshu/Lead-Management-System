import { RateReview } from "@mui/icons-material";
import {
  Avatar,
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Loader";
import "../../index.css";

const AddEnquiry = () => {
  const [emp, setEmp] = useState([]);
  const [isloading, setLoading] = useState(false);
  const getEmpData = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/api/getemployees`)
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          setEmp(response.data.data);
        }
      })
      .catch((error) => {
        if (error?.response.status === 400) {
          return <h1>Data Not Found</h1>;
        }
        if (error?.response.status === 404) {
          console.log(error.response.data.message);
        }
      });
  };
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      getEmpData();
    }, 650);
  }, []);

  const navigate = useNavigate();
  var regfirstname = /^[a-zA-Z ]{2,30}$/;
  var reglastname = /^[a-zA-Z ]{2,30}$/;
  var regemail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var regphone = /^[1-9]\d{9}$/;

  const [enquiry, setEnquiry] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    company: "",
    enquiry: "",
    assign: "",
  });
  const handleAddEnquiryChange = (e) => {
    const { name, value } = e.target;
    setEnquiry({
      ...enquiry,
      [name]: value,
    });
  };

  const HandleAddEnquiry = async (e) => {
    e.preventDefault();
    if (!regfirstname.test(enquiry.firstname)) {
      toast.error("Please Enter the Valid Firstname");
      return;
    }
    if (!reglastname.test(enquiry.lastname)) {
      toast.error("Please Enter the Valid Lastname");
      return;
    }
    if (!regemail.test(enquiry.email)) {
      toast.error("Please Enter the Valid Email");
      return;
    }
    if (!regphone.test(enquiry.phone)) {
      toast.error("Please Enter the Valid Phone Number");
      return;
    }

    if (!enquiry.enquiry) {
      toast.error("Please send us a Designation");
      return;
    }
    try {
      const body = {
        firstname: enquiry.firstname,
        lastname: enquiry.lastname,
        email: enquiry.email,
        phone: enquiry.phone,
        company: enquiry.company,
        enquiry: enquiry.enquiry,
        assign: enquiry.assign,
      };
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/addenquiry`,
        body
      );
      if (res && res.data.success) {
        toast.success(res.data.message);
        navigate("/enquiry");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      {isloading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <Grid
            padding={2}
            container
            align="center"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid
              item
              xs={10}
              sm={8}
              md={4}
              className="grid-hover"
              square="true"
            >
              <Paper elevation={24} sx={{ padding: "20px" }}>
                <Grid
                  paddingBottom={3}
                  item
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar sx={{ background: "#202c70", marginRight: "10px" }}>
                    <RateReview />
                  </Avatar>
                  <Typography
                    className="font"
                    variant="h4"
                    color="#202c70"
                    align="center"
                    fontWeight={"bolder"}
                  >
                    Add Lead
                  </Typography>
                </Grid>

                <form autoComplete="on">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Firstname"
                        placeholder="Enter Your Firstname"
                        fullWidth
                        value={enquiry.firstname}
                        onChange={handleAddEnquiryChange}
                        name="firstname"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Lastname"
                        placeholder="Enter Your Lastname"
                        fullWidth
                        value={enquiry.lastname}
                        onChange={handleAddEnquiryChange}
                        name="lastname"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Email"
                        placeholder="Enter Your Email"
                        fullWidth
                        value={enquiry.email}
                        onChange={handleAddEnquiryChange}
                        name="email"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Phone Number"
                        placeholder="Enter Your Number"
                        type="number"
                        fullWidth
                        value={enquiry.phone}
                        onChange={handleAddEnquiryChange}
                        name="phone"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Company"
                        placeholder="Enter Your Company Name"
                        name="company"
                        type="text"
                        fullWidth
                        value={enquiry.company}
                        onChange={handleAddEnquiryChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth align="left">
                        <InputLabel id="workExp">Work Assign To</InputLabel>
                        <Select
                          labelId="workExp"
                          label="Work Experience"
                          className="text-start"
                          name="assign"
                          value={enquiry.assign}
                          onChange={handleAddEnquiryChange}
                        >
                          {emp.map((row, index) => (
                            <MenuItem value={row._id} key={index}>
                              {row.firstname}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        name="enquiry"
                        placeholder="Lead Details"
                        label="Lead"
                        multiline
                        rows={4}
                        value={enquiry.enquiry}
                        onChange={handleAddEnquiryChange}
                      />
                    </Grid>
                  </Grid>

                  <ButtonGroup
                    sx={{
                      margin: "25px 0 0 0",
                    }}
                  >
                    <Link to="/enquiry" className="btn-link">
                      <Button variant="contained" sx={{ marginRight: "10px" }}>
                        Cancel
                      </Button>
                    </Link>
                    <Button variant="contained" onClick={HandleAddEnquiry}>
                      Add
                    </Button>
                  </ButtonGroup>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default AddEnquiry;
