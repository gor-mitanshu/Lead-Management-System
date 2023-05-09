import { PersonAdd } from "@mui/icons-material";
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

const AddClient = () => {
  const [isloading, setLoading] = useState(false);
  const [emp, setEmp] = useState([]);
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
  var regfirstname = /^[a-zA-Z]{2,30}$/;
  var reglastname = /^[a-zA-Z]{2,30}$/;
  var regemail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var regphone = /^[1-9]\d{9}$/;

  const [addClient, setAddClient] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    assign: "",
  });
  const handleAddClient = (e) => {
    const { name, value } = e.target;
    setAddClient({
      ...addClient,
      [name]: value,
    });
  };
  const AddClient = async (e) => {
    e.preventDefault();
    if (!regfirstname.test(addClient.firstname)) {
      toast.error("Please Enter the Valid Firstname");
      return;
    }
    if (!reglastname.test(addClient.lastname)) {
      toast.error("Please Enter the Valid Lastname");
      return;
    }
    if (!regemail.test(addClient.email)) {
      toast.error("Please Enter the Valid Email");
      return;
    }
    if (!regphone.test(addClient.phone)) {
      toast.error("Please Enter the Valid Phone Number");
      return;
    }
    if (!addClient.assign) {
      toast.error("Please Assign any Employee");
      return;
    }
    const body = {
      firstname: addClient.firstname,
      lastname: addClient.lastname,
      email: addClient.email,
      phone: addClient.phone,
      assign: addClient.assign,
    };
    await axios
      .post(`${process.env.REACT_APP_API}/api/addclient`, body)
      .then((response) => {
        if (response?.status === 200) {
          toast.success("Client added successfully");
          navigate("/clients");
        }
      })
      .catch((error) => {
        if (error?.response.status === 404) {
          toast.error("Some Error Occured");
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
          <Grid container>
            <Grid align="center" item lg={4} xs={12} sm={8} md={10} mx="auto">
              <Paper
                elevation={24}
                sx={{ margin: "30px auto", padding: "38px 20px" }}
              >
                <Grid
                  item
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px",
                  }}
                >
                  <Avatar sx={{ background: "green", marginRight: "10px" }}>
                    <PersonAdd />
                  </Avatar>
                  <Typography
                    variant="h4"
                    component="h1"
                    align="center"
                    sx={{
                      padding: "10px 0",
                      fontWeight: "bolder",
                    }}
                  >
                    Add Client
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
                        value={addClient.firstname}
                        onChange={handleAddClient}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Lastname"
                        placeholder="Enter Your Lastname"
                        fullWidth
                        name="lastname"
                        value={addClient.lastname}
                        onChange={handleAddClient}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Email"
                        placeholder="Enter Your Email"
                        fullWidth
                        name="email"
                        value={addClient.email}
                        onChange={handleAddClient}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Phone Number"
                        placeholder="Enter Your Number"
                        type="number"
                        fullWidth
                        name="phone"
                        value={addClient.phone}
                        onChange={handleAddClient}
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
                          value={addClient.assign}
                          onChange={handleAddClient}
                        >
                          {emp.map((row, index) => (
                            <MenuItem value={row._id} key={index}>
                              {row.firstname}{" "}
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
                    <Button variant="contained" onClick={AddClient}>
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

export default AddClient;
