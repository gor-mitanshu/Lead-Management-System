import { ChangeCircle, Visibility, VisibilityOff } from "@mui/icons-material";
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
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ChangePassword = () => {
  const id = useParams();
  var regpassword =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  const navigate = useNavigate();
  const [password, setPassword] = useState({
    password: "",
    cpassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handlechange = (e) => {
    const { name, value } = e.target;
    setPassword({
      ...password,
      [name]: value,
    });
  };
  const HandleChangePass = (e) => {
    e.preventDefault();
    if (!password.password || !password.cpassword) {
      toast.error("Please Enter the both Fields");
      return;
    }
    if (!regpassword.test(password.password)) {
      toast.error("Please Enter the Valid Password");
      return;
    }
    if (password.cpassword !== password.password) {
      toast.error("Please Enter the Same Password");
      return;
    }
    const accessToken = localStorage.getItem("auth");
    const body = {
      accessToken: accessToken,
      password: password.password,
    };
    if (accessToken) {
      axios
        .put(`${process.env.REACT_APP_API}/api/changepassword/${id.id}`, body)
        .then((response) => {
          if (response.status === 200) {
            toast.success(response.data.message);
            navigate("/");
          } else {
            toast.error(response.data.message);
          }
        });
    }
  };

  return (
    <>
      <Grid
        container
        padding={2}
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
              xs={12}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar sx={{ background: "#202c70", marginRight: "5px" }}>
                <ChangeCircle />
              </Avatar>
              <Typography
                className="font"
                variant="h5"
                color="#202c70"
                fontWeight={"bolder"}
                align="center"
              >
                Change Password
              </Typography>
            </Grid>

            <form autoComplete="on">
              <TextField
                type={showPassword ? "text" : "password"}
                label="Password"
                fullWidth
                value={password.password}
                onChange={handlechange}
                name="password"
                sx={{ margin: "25px 0 0 0 " }}
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

              <TextField
                type={showPassword ? "text" : "password"}
                label="Confirm Password"
                sx={{ margin: "20px 0 0 0" }}
                fullWidth
                value={password.cpassword}
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

              <Button
                type="submit"
                variant="contained"
                sx={{ margin: "25px 0 0 0" }}
                onClick={HandleChangePass}
              >
                Change Password
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ChangePassword;
