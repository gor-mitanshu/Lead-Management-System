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

const EditClient = () => {
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
          console.log("Some Error Occured");
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
  const { id } = useParams("");
  var regfirstname = /^[a-zA-Z]{2,30}$/;
  var reglastname = /^[a-zA-Z]{2,30}$/;
  var regemail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var regphone = /^[1-9]\d{9}$/;

  const [updateclient, setUpdateClient] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    assign: "",
    employeename: "",
  });
  const handleEditClient = (e) => {
    const { name, value } = e.target;
    setUpdateClient({
      ...updateclient,
      [name]: value,
    });
  };

  const viewClient = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/api/geteditclient/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setUpdateClient(response.data.data);
        } else {
          toast.error("Unable to Update User");
        }
      });
  };
  useEffect(() => {
    viewClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const EditClient = async (e) => {
    e.preventDefault();
    if (!regfirstname.test(updateclient.firstname)) {
      toast.error("Please Enter the Valid Firstname");
      return;
    }
    if (!reglastname.test(updateclient.lastname)) {
      toast.error("Please Enter the Valid Lastname");
      return;
    }
    if (!regemail.test(updateclient.email)) {
      toast.error("Please Enter the Valid Email");
      return;
    }
    if (!regphone.test(updateclient.phone)) {
      toast.error("Please Enter the Valid Phone Number");
      return;
    }
    if (!updateclient.assign) {
      toast.error("Please Assign any Employee");
      return;
    }
    const body = {
      firstname: updateclient.firstname,
      lastname: updateclient.lastname,
      email: updateclient.email,
      phone: updateclient.phone,
      assign: updateclient.assign,
    };
    axios
      .put(`${process.env.REACT_APP_API}/api/updateclient/${id}`, body)
      .then((response) => {
        if (response) {
          toast.success("Updated Data Successfully");
          navigate("/clients");
        } else {
          toast.error("Error Updating");
        }
      });
  };
  return (
    <>
      {isloading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <Grid container padding={3}>
            <Grid align="center" item lg={4} xs={12} sm={8} md={10} mx="auto">
              <Paper elevation={24} sx={{ padding: "30px" }}>
                <Grid
                  item
                  paddingBottom={3}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Avatar sx={{ background: "#202c70", marginRight: "10px" }}>
                    <Edit />
                  </Avatar>
                  <Typography
                    variant="h4"
                    className="font"
                    fontWeight="bolder"
                    align="center"
                    color="202c70"
                  >
                    Update Client
                  </Typography>
                </Grid>
                <form autoComplete="on">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Firstname"
                        placeholder="Enter Your Firstname"
                        fullWidth
                        name="firstname"
                        value={updateclient.firstname}
                        onChange={handleEditClient}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Lastname"
                        placeholder="Enter Your Lastname"
                        fullWidth
                        name="lastname"
                        value={updateclient.lastname}
                        onChange={handleEditClient}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Email"
                        placeholder="Enter Your Email"
                        fullWidth
                        name="email"
                        value={updateclient.email}
                        onChange={handleEditClient}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Phone Number"
                        placeholder="Enter Your Number"
                        type="number"
                        fullWidth
                        name="phone"
                        value={updateclient.phone}
                        onChange={handleEditClient}
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
                          value={updateclient.assign}
                          onChange={handleEditClient}
                        >
                          {emp.map((row, index) => (
                            <MenuItem value={row._id} key={index}>
                              {row.firstname}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <ButtonGroup
                    sx={{
                      margin: "25px 0 0 0",
                    }}
                  >
                    <Link to="/clients" className="btn-link">
                      <Button variant="contained" sx={{ marginRight: "10px" }}>
                        Cancel
                      </Button>
                    </Link>
                    <Button variant="contained" onClick={EditClient}>
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

export default EditClient;
