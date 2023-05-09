import { PersonAdd } from "@mui/icons-material";
import {
  Avatar,
  Button,
  ButtonGroup,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Loader";

const AddEmployee = () => {
  const navigate = useNavigate();
  var regfirstname = /^[a-zA-Z]{2,30}$/;
  var reglastname = /^[a-zA-Z]{2,30}$/;
  var regemail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var regphone = /^[1-9]\d{9}$/;

  const [isloading, setLoading] = useState(false);
  const [addEmp, setAddEmp] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });
  const handleAddEmp = (e) => {
    const { name, value } = e.target;
    setLoading(false);
    setAddEmp({
      ...addEmp,
      [name]: value,
    });
  };
  const AddEmp = async (e) => {
    e.preventDefault();
    if (!regfirstname.test(addEmp.firstname)) {
      toast.error("Please Enter the Valid Firstname");
      return;
    }
    if (!reglastname.test(addEmp.lastname)) {
      toast.error("Please Enter the Valid Lastname");
      return;
    }
    if (!regemail.test(addEmp.email)) {
      toast.error("Please Enter the Valid Email");
      return;
    }
    if (!regphone.test(addEmp.phone)) {
      toast.error("Please Enter the Valid Phone Number");
      return;
    }

    const body = {
      firstname: addEmp.firstname,
      lastname: addEmp.lastname,
      email: addEmp.email,
      phone: addEmp.phone,
    };
    await axios
      .post(`${process.env.REACT_APP_API}/api/addemployees`, body)
      .then((response) => {
        if (response?.status === 200) {
          toast.success("Employee added successfully");
          navigate("/employees");
        }
      })
      .catch((error) => {
        if (error?.response.status === 404) {
          toast.error("Some Error Occured");
        }
      });
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 650);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                    Add Employee
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
                        value={addEmp.firstname}
                        onChange={handleAddEmp}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Lastname"
                        placeholder="Enter Your Lastname"
                        fullWidth
                        name="lastname"
                        value={addEmp.lastname}
                        onChange={handleAddEmp}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Email"
                        placeholder="Enter Your Email"
                        fullWidth
                        name="email"
                        value={addEmp.email}
                        onChange={handleAddEmp}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Phone Number"
                        placeholder="Enter Your Number"
                        type="number"
                        fullWidth
                        name="phone"
                        value={addEmp.phone}
                        onChange={handleAddEmp}
                      />
                    </Grid>
                  </Grid>
                  <ButtonGroup
                    sx={{
                      margin: "25px 0 0 0",
                    }}
                  >
                    <Link to="/employees" className="btn-link">
                      <Button variant="contained" sx={{ marginRight: "10px" }}>
                        Cancel
                      </Button>
                    </Link>
                    <Button variant="contained" onClick={AddEmp}>
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

export default AddEmployee;
