import { Edit } from "@mui/icons-material";
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
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Loader";
import "../../index.css";

const EditLead = () => {
  const [emp, setEmp] = useState([]);
  const [status, setStatus] = useState([]);
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
    setStatus(["PENDING", "REJECTED", "COMPLETED"]);
    setTimeout(() => {
      getEmpData();
    }, 650);
  }, []);

  const navigate = useNavigate();
  const { id } = useParams("");
  var regfirstname = /^[a-zA-Z]{2,30}$/;
  var reglastname = /^[a-zA-Z]{2,30}$/;
  var regemail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var regphone = /^[1-9]\d{9}$/;

  const [role, setRole] = useState();
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("auth")).result.token;
    const data = JSON.parse(atob(token.split(".")[1])).admin;
    setRole(data.role);
  }, []);

  const [updatLead, setUpdatLead] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    company: "",
    enquiry: "",
    assign: "",
    employeename: "",
    status: "",
  });
  const handleEditEnq = (e) => {
    const { name, value } = e.target;
    setUpdatLead({
      ...updatLead,
      [name]: value,
    });
  };

  const viewEnq = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/api/lead/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setUpdatLead(response.data.data);
        } else {
          toast.error(response.data.message);
        }
      });
  };
  useEffect(() => {
    viewEnq();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const EditEnq = async (e) => {
    e.preventDefault();
    if (!regfirstname.test(updatLead.firstname)) {
      toast.error("Please Enter the Valid Firstname");
      return;
    }
    if (!reglastname.test(updatLead.lastname)) {
      toast.error("Please Enter the Valid Lastname");
      return;
    }
    if (!regemail.test(updatLead.email)) {
      toast.error("Please Enter the Valid Email");
      return;
    }
    if (!regphone.test(updatLead.phone)) {
      toast.error("Please Enter the Valid Phone Number");
      return;
    }
    if (!updatLead.enquiry) {
      toast.error("Please send us a Lead");
      return;
    }
    if (!updatLead.assign) {
      toast.error("Please Assign any Employee");
      return;
    }
    try {
      const body = {
        firstname: updatLead.firstname,
        lastname: updatLead.lastname,
        email: updatLead.email,
        phone: updatLead.phone,
        company: updatLead.company,
        enquiry: updatLead.enquiry,
        assign: updatLead.assign,
        status: updatLead.status,
      };
      const res = await axios.put(
        `${process.env.REACT_APP_API}/api/updatelead/${id}`,
        body
      );
      if (res && res.data.success) {
        toast.success(res.data.message);
        navigate("/lead");
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
          <Grid container padding={2}>
            <Grid align="center" item lg={4} xs={12} sm={8} md={10} mx="auto">
              <Paper elevation={24} sx={{ padding: "30px" }}>
                <Grid
                  item
                  paddingBottom={3}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar sx={{ background: "#202c70", marginRight: "10px" }}>
                    <Edit />
                  </Avatar>
                  <Typography
                    variant="h4"
                    className="font"
                    align="center"
                    fontWeight="bolder"
                    color="#202c70"
                  >
                    Update Lead
                  </Typography>
                </Grid>
                <form autoComplete="on">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        disabled={role === "admin" ? false : true}
                        label="Firstname"
                        placeholder="Enter Your Firstname"
                        fullWidth
                        name="firstname"
                        value={updatLead.firstname}
                        onChange={handleEditEnq}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        disabled={role === "admin" ? false : true}
                        label="Lastname"
                        placeholder="Enter Your Lastname"
                        fullWidth
                        name="lastname"
                        value={updatLead.lastname}
                        onChange={handleEditEnq}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        disabled={role === "admin" ? false : true}
                        label="Email"
                        placeholder="Enter Your Email"
                        fullWidth
                        name="email"
                        value={updatLead.email}
                        onChange={handleEditEnq}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        disabled={role === "admin" ? false : true}
                        label="Phone Number"
                        placeholder="Enter Your Number"
                        type="number"
                        fullWidth
                        name="phone"
                        value={updatLead.phone}
                        onChange={handleEditEnq}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        disabled={role === "admin" ? false : true}
                        label="Company"
                        placeholder="Enter Your Company Name"
                        name="company"
                        type="text"
                        size="small"
                        fullWidth
                        value={updatLead.company}
                        onChange={handleEditEnq}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth align="left">
                        <InputLabel id="workExp">Status</InputLabel>
                        <Select
                          labelId="workExp"
                          label="Work Experience"
                          className="text-start"
                          name="status"
                          value={updatLead.status}
                          onChange={handleEditEnq}
                        >
                          {status.map((row, index) => (
                            <MenuItem value={row} key={index}>
                              {row}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth align="left">
                        <InputLabel
                          id="workExp"
                          disabled={role === "admin" ? false : true}
                        >
                          Work Assign To
                        </InputLabel>
                        <Select
                          disabled={role === "admin" ? false : true}
                          labelId="workExp"
                          label="Work Experience"
                          className="text-start"
                          name="assign"
                          value={updatLead.assign}
                          onChange={handleEditEnq}
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
                        disabled={role === "admin" ? false : true}
                        fullWidth
                        variant="outlined"
                        name="enquiry"
                        placeholder="Details"
                        label="Comments"
                        multiline
                        rows={4}
                        value={updatLead.enquiry}
                        onChange={handleEditEnq}
                      />
                    </Grid>
                  </Grid>
                  <ButtonGroup
                    sx={{
                      margin: "25px 0 0 0",
                    }}
                  >
                    <Link to="/lead" className="btn-link">
                      <Button variant="contained" sx={{ marginRight: "10px" }}>
                        Cancel
                      </Button>
                    </Link>
                    <Button variant="contained" onClick={EditEnq}>
                      Update
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

export default EditLead;
