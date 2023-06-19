import { HowToReg, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
const Register = () => {
  var regfirstname = /^[a-zA-Z]{2,30}$/;
  var reglastname = /^[a-zA-Z]{2,30}$/;
  var regemail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var regphone = /^[1-9]\d{9}$/;
  var regpassword =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
    key: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handlechange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };
  const navigate = useNavigate();
  const HandleAdminRegister = async (e) => {
    e.preventDefault();
    if (!regfirstname.test(user.firstname)) {
      toast.error("Please Enter the Valid Firstname");
      return;
    }
    if (!reglastname.test(user.lastname)) {
      toast.error("Please Enter the Valid Lastname");
      return;
    }
    if (!regemail.test(user.email)) {
      toast.error("Please Enter the Valid Email");
      return;
    }
    if (!regphone.test(user.phone)) {
      toast.error("Please Enter the Valid Phone Number");
      return;
    }
    if (!regpassword.test(user.password)) {
      toast.error("Please Enter the Valid Password");
      return;
    }
    if (user.cpassword !== user.password) {
      toast.error("Please Enter the Same Password");
      return;
    }
    if (!user.key) {
      toast.error("Please Enter the Secret Key");
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/adminregister`,
        {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          password: user.password,
          key: user.key,
        }
      );
      if (res && res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data.message);
    }
  };
  return (
    <>
      <Grid
        container
        padding={2}
        align="center"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item xs={10} sm={8} md={4} className="grid-hover" square="true">
          <Paper
            elevation={24}
            sx={{
              padding: "20px 20px",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Grid
              item
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar sx={{ background: "#202c70", marginRight: "10px" }}>
                <HowToReg />
              </Avatar>
              <Typography
                variant="h4"
                color="#202c70"
                align="center"
                sx={{
                  padding: "10px 0",
                  fontWeight: "bolder",
                }}
              >
                Register
              </Typography>
            </Grid>
            <Typography variant="caption" sx={{ marginBottom: "20px" }}>
              Please fill out the form to register your account.
            </Typography>
            <form autoComplete="on" onSubmit={HandleAdminRegister}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Firstname"
                    placeholder="Enter Your Firstname"
                    fullWidth
                    value={user.firstname}
                    onChange={handlechange}
                    name="firstname"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Lastname"
                    placeholder="Enter Your Lastname"
                    fullWidth
                    value={user.lastname}
                    onChange={handlechange}
                    name="lastname"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    placeholder="Enter Your Email"
                    fullWidth
                    value={user.email}
                    onChange={handlechange}
                    name="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone Number"
                    placeholder="Enter Your Number"
                    type="number"
                    fullWidth
                    value={user.phone}
                    onChange={handlechange}
                    name="phone"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type={showPassword ? "text" : "password"}
                    label="Password"
                    fullWidth
                    value={user.password}
                    onChange={handlechange}
                    name="password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type={showPassword ? "text" : "password"}
                    label="Confirm Password"
                    fullWidth
                    value={user.cpassword}
                    onChange={handlechange}
                    name="cpassword"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="text"
                    label="Key"
                    placeholder="Enter Your Secret Key"
                    fullWidth
                    value={user.key}
                    onChange={handlechange}
                    name="key"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                sx={{ margin: "25px 0 0 0" }}
              >
                Submit
              </Button>
              <Typography sx={{ margin: "15px 0 0 0" }}>
                Already have an account? &nbsp;
                <Link to={"/login"} style={{ textDecoration: "none" }}>
                  Login
                </Link>
              </Typography>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
export default Register;
