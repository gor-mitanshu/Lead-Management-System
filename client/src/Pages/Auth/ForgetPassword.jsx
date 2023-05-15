import { Lock, Visibility, VisibilityOff } from "@mui/icons-material";
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
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const ForgetPassword = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
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
  const HandleForgetPass = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/forgetpassword`,
        {
          email: user.email,
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
      toast.error(error.response.data.message);
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
        <Grid
          item
          xs={10}
          sm={8}
          md={6}
          lg={3}
          className="grid-hover"
          square="true"
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
              lg={12}
              xs={12}
              paddingBottom={3}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar sx={{ background: "#202c70", marginRight: "5px" }}>
                <Lock />
              </Avatar>
              <Typography
                variant="h5"
                align="center"
                color="#202c70"
                fontWeight={"bolder"}
              >
                Forget Password
              </Typography>
            </Grid>

            <form autoComplete="on" onSubmit={HandleForgetPass}>
              <Grid xs={12}>
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
              </Grid>

              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  type="text"
                  label="Key"
                  placeholder="Enter Your Secret Answer"
                  fullWidth
                  value={user.key}
                  onChange={handlechange}
                  name="key"
                />
              </Grid>
              <Grid xs={12}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  label="Password"
                  name="password"
                  placeholder="Enter New Password"
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
              </Grid>

              <ButtonGroup
                sx={{
                  margin: "25px 0 0 0",
                }}
              >
                <Link to="/login" className="btn-link">
                  <Button variant="contained" sx={{ marginRight: "10px" }}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" variant="contained">
                  Reset
                </Button>
              </ButtonGroup>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ForgetPassword;
