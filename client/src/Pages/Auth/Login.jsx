import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import "../../index.css";
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
import useAuth from "../useAuth";
import { useLocation } from "react-router-dom";
const Login = () => {
  const { login } = useAuth();
  const { state } = useLocation();
  const [user, setUser] = useState({
    email: "",
    password: "",
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
  const HandleAdminLogin = async (e) => {
    e.preventDefault(e);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/api/login`, {
        email: user.email,
        password: user.password,
      });
      if (res && res.data.success) {
        login();
        toast.success(res.data.message);
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(state?.path || "/", { replace: true });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <>
      <Grid
        padding={2}
        container
        align="center"
        sx={{
          height: "100vh",
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
          lg={3}
          square="true"
          className="grid-hover"
        >
          <Paper
            elevation={24}
            sx={{
              padding: "40px 20px",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Grid
              item
              lg={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar sx={{ background: "#202c70", marginRight: "10px" }}>
                <Lock />
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
                Login
              </Typography>
            </Grid>
            <form autoComplete="on" onSubmit={HandleAdminLogin}>
              <TextField
                variant="outlined"
                margin="dense"
                fullWidth
                label="Email"
                name="email"
                placeholder="Enter Email"
                type="email"
                value={user.email}
                onChange={handlechange}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="dense"
                fullWidth
                label="Password"
                name="password"
                placeholder="Enter Password"
                type={showPassword ? "text" : "password"}
                value={user.password}
                onChange={handlechange}
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
              <Button
                type="submit"
                sx={{ margin: "25px 0 0 0" }}
                variant="contained"
              >
                Login
              </Button>
              <Typography sx={{ margin: "15px 0 0 0" }}>
                <Link to={"/forgetpassword"} className="btn-link">
                  Forget Password
                </Link>
              </Typography>
              <Typography sx={{ margin: "15px 0 0 0" }}>
                Do you have an account? &nbsp;
                <Link to={"/register"} className="btn-link">
                  Sign Up
                </Link>
              </Typography>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};
export default Login;
