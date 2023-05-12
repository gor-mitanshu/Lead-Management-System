import { Visibility } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../Loader";
import "../../index.css";

const ViewEnquiry = () => {
  const [viewenquiry, setViewenquiry] = useState({
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

  const [isloading, setLoading] = useState(false);
  const { id } = useParams("");

  const viewEnq = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/getenquirydetails/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          setViewenquiry(response.data.data);
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
      viewEnq();
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
          <Grid container padding={3}>
            <Grid align="center" item lg={4} xs={12} sm={8} md={10} mx="auto">
              <Paper elevation={24} sx={{ padding: "30px" }}>
                <Grid
                  paddingBottom={3}
                  item
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar sx={{ marginRight: "10px", background: "#202c70" }}>
                    <Visibility />
                  </Avatar>
                  <Typography
                    className="font"
                    color={"#202c70"}
                    variant="h4"
                    align="center"
                    fontWeight="bolder"
                  >
                    View Lead
                  </Typography>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Firstname"
                      placeholder="Enter Your Firstname"
                      fullWidth
                      name="firstname"
                      value={viewenquiry.firstname}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Lastname"
                      placeholder="Enter Your Lastname"
                      fullWidth
                      name="lastname"
                      value={viewenquiry.lastname}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      placeholder="Enter Your Email"
                      fullWidth
                      name="email"
                      value={viewenquiry.email}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Phone Number"
                      placeholder="Enter Your Number"
                      type="number"
                      fullWidth
                      name="phone"
                      value={viewenquiry.phone}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Company"
                      placeholder="Enter Your Company Name"
                      name="company"
                      type="text"
                      size="small"
                      fullWidth
                      value={viewenquiry.company}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Assign"
                      placeholder="Enter Your Company Name"
                      name="assign"
                      type="text"
                      size="small"
                      fullWidth
                      value={viewenquiry.employeename}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="enquiry"
                      placeholder="Lead Details"
                      label="Lead"
                      multiline
                      rows={3}
                      value={viewenquiry.enquiry}
                    />
                  </Grid>
                </Grid>

                <Link to="/enquiry" className="btn-link">
                  <Button
                    variant="contained"
                    sx={{
                      margin: "25px 0 0 0",
                    }}
                  >
                    Back
                  </Button>
                </Link>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default ViewEnquiry;
