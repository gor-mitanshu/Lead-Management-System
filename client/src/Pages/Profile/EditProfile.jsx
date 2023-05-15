import { ModeEdit } from "@mui/icons-material";
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
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Loader";
import "../../index.css";

const EditProfile = () => {
  var regfirstname = /^[a-zA-Z]{2,30}$/;
  var reglastname = /^[a-zA-Z]{2,30}$/;
  var regemail =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  var regphone = /^[1-9]\d{9}$/;
  const navigate = useNavigate();
  const [isloading, setLoading] = useState(false);
  const [edit, setEdit] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });
  const { id } = useParams();

  const handleEdit = (e) => {
    const { name, value } = e.target;
    setEdit({
      ...edit,
      [name]: value,
    });
  };

  const getProfile = async () => {
    const accessToken = localStorage.getItem("auth");
    if (accessToken) {
      axios
        .get(`${process.env.REACT_APP_API}/api/profile`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
          setLoading(false);
          setEdit(response.data.data);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  };
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      getProfile();
    }, 650);
  }, []);

  const updateData = () => {
    if (!edit.firstname || !edit.lastname || !edit.email || !edit.phone) {
      toast.error("Please Enter all fields to Update");
      return;
    }
    if (!edit.firstname) {
      toast.error("Please Enter Firstname to Update");
      return;
    }
    if (!edit.lastname) {
      toast.error("Please Enter Lastname to Update");
      return;
    }
    if (!edit.phone) {
      toast.error("Please Enter Phone Number to Update");
      return;
    }
    if (!regfirstname.test(edit.firstname)) {
      toast.error("Please Enter the Valid Firstname");
      return;
    }
    if (!reglastname.test(edit.lastname)) {
      toast.error("Please Enter the Valid Lastname");
      return;
    }
    if (!regemail.test(edit.email)) {
      toast.error("Please Enter the Valid Email");
      return;
    }
    if (!regphone.test(edit.phone)) {
      toast.error("Please Enter the Valid Phone Number");
      return;
    }

    const body = {
      firstname: edit.firstname,
      lastname: edit.lastname,
      email: edit.email,
      phone: edit.phone,
    };
    axios
      .put(`${process.env.REACT_APP_API}/api/editprofile/${id}`, body)
      .then((response) => {
        if (response) {
          toast.success(response.data.message);
          navigate("/profile");
        } else if (response.status === 404) {
          toast.error(response.data.message);
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
          {edit ? (
            <Grid container padding={2}>
              <Grid align="center" item lg={6} xs={12} sm={8} md={10} mx="auto">
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
                      <ModeEdit />
                    </Avatar>
                    <Typography
                      variant="h4"
                      className="font"
                      color="#202c70"
                      align="center"
                      fontWeight={"bolder"}
                    >
                      Edit Profile
                    </Typography>
                  </Grid>
                  <form autoComplete="on">
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          label="Firstname"
                          placeholder="Enter Your Firstname"
                          fullWidth
                          value={edit.firstname}
                          onChange={handleEdit}
                          name="firstname"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Lastname"
                          placeholder="Enter Your Lastname"
                          fullWidth
                          value={edit.lastname}
                          onChange={handleEdit}
                          name="lastname"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Email"
                          placeholder="Enter Your Email"
                          fullWidth
                          value={edit.email}
                          onChange={handleEdit}
                          name="email"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Phone Number"
                          placeholder="Enter Your Number"
                          type="number"
                          fullWidth
                          value={edit.phone}
                          onChange={handleEdit}
                          name="phone"
                        />
                      </Grid>
                    </Grid>
                    <ButtonGroup
                      sx={{
                        margin: "25px 0 0 0",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{ marginRight: "10px" }}
                        onClick={() => navigate("/profile")}
                      >
                        Cancel
                      </Button>
                      <Button variant="contained" onClick={updateData}>
                        Save
                      </Button>
                    </ButtonGroup>
                  </form>
                </Paper>
              </Grid>
            </Grid>
          ) : null}
        </>
      )}
    </>
  );
};

export default EditProfile;
