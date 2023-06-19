import { Edit, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Avatar,
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Loader";
import "../../index.css";
const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams("");
  var regfirstname = /^[a-zA-Z]{2,30}$/;
  var reglastname = /^[a-zA-Z]{2,30}$/;
  var regemail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var regphone = /^[1-9]\d{9}$/;
  const [showPassword, setShowPassword] = useState(false);
  const [isloading, setLoading] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const [updatEmp, setUpdatEmp] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
  });
  const handleEditEmp = (e) => {
    const { name, value } = e.target;
    setUpdatEmp({
      ...updatEmp,
      [name]: value,
    });
  };
  const viewEmp = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/api/getemployee/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          setUpdatEmp(response.data.data);
        } else {
          toast.error(response.data.message);
        }
      });
  };
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      viewEmp();
    }, 650);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const EditSubmit = async (e) => {
    e.preventDefault();
    if (!regfirstname.test(updatEmp.firstname)) {
      toast.error("Please Enter the Valid Firstname");
      return;
    }
    if (!reglastname.test(updatEmp.lastname)) {
      toast.error("Please Enter the Valid Lastname");
      return;
    }
    if (!regemail.test(updatEmp.email)) {
      toast.error("Please Enter the Valid Email");
      return;
    }
    if (!updatEmp.password) {
      toast.error("Please Enter the Valid Password");
      return;
    }
    if (!regphone.test(updatEmp.phone)) {
      toast.error("Please Enter the Valid Phone Number");
      return;
    }
    try {
      const body = {
        firstname: updatEmp.firstname,
        lastname: updatEmp.lastname,
        email: updatEmp.email,
        phone: updatEmp.phone,
        password: updatEmp.password,
      };
      const res = await axios.put(
        `${process.env.REACT_APP_API}/api/editemployee/${id}`,
        body
      );
      if (res && res.data.success) {
        toast.success(res.data.message);
        navigate("/employees");
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
                  marginBottom={4}
                  item
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
                    className="font"
                    color="#202c70"
                    variant="h4"
                    align="center"
                    fontWeight={"bolder"}
                    sx={{ display: "flex", flexWrap: "wrap" }}
                  >
                    Update Employee
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
                        value={updatEmp.firstname}
                        onChange={handleEditEmp}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Lastname"
                        placeholder="Enter Your Lastname"
                        fullWidth
                        name="lastname"
                        value={updatEmp.lastname}
                        onChange={handleEditEmp}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Email"
                        placeholder="Enter Your Email"
                        fullWidth
                        name="email"
                        value={updatEmp.email}
                        onChange={handleEditEmp}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Phone Number"
                        placeholder="Enter Your Number"
                        type="number"
                        fullWidth
                        name="phone"
                        value={updatEmp.phone}
                        onChange={handleEditEmp}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        placeholder="Enter Your Password"
                        fullWidth
                        name="password"
                        value={updatEmp.password}
                        onChange={handleEditEmp}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                  <ButtonGroup
                    sx={{
                      margin: "24px 0 0 0",
                    }}
                  >
                    <Link to="/employees" className="btn-link">
                      <Button variant="contained" sx={{ marginRight: "10px" }}>
                        Cancel
                      </Button>
                    </Link>
                    <Button variant="contained" onClick={EditSubmit}>
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
export default EditEmployee;
