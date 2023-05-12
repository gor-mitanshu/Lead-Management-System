import {
  Button,
  Grid,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Loader from "../Loader";
import "../../index.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [isloading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });
  const [id, setId] = useState();
  useEffect(() => {
    const accessToken = localStorage.getItem("auth");
    setLoading(true);
    setTimeout(() => {
      if (accessToken) {
        axios
          .get(`${process.env.REACT_APP_API}/api/profile`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          .then((response) => {
            setLoading(false);
            setProfile(response.data.data);
            setId(response.data.data._id);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, 650);
  }, []);
  return (
    <>
      {isloading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          {profile ? (
            <Grid container padding={3}>
              <Grid
                align="center"
                item
                lg={6}
                xs={12}
                sm={10}
                md={10}
                mx="auto"
              >
                <Paper elevation={24}>
                  <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                      padding: "20px 0",
                      fontWeight: "bolder",
                      background: "#000000",
                      color: "white",
                    }}
                  >
                    Personal Profile
                  </Typography>
                  <Grid sx={{ padding: "20px 10px" }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: "700",
                              fontSize: "20px",
                              color: "GrayText",
                              paddingTop: "30px",
                            }}
                          >
                            Firstname:
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "700",
                              color: "green",
                              fontSize: "20px",
                              textTransform: "uppercase",
                              paddingTop: "30px",
                            }}
                          >
                            {profile.firstname}
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: "700",
                              fontSize: "20px",
                              color: "GrayText",
                              paddingTop: "30px",
                            }}
                          >
                            Lastname:
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "700",
                              color: "green",
                              fontSize: "20px",
                              textTransform: "uppercase",
                              paddingTop: "30px",
                            }}
                          >
                            {profile.lastname}
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: "700",
                              fontSize: "20px",
                              color: "GrayText",
                              paddingTop: "30px",
                            }}
                          >
                            Email:
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "700",
                              color: "green",
                              fontSize: "20px",
                              paddingTop: "30px",
                            }}
                          >
                            {profile.email}
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              fontWeight: "700",
                              fontSize: "20px",
                              color: "GrayText",
                              paddingTop: "30px",
                            }}
                          >
                            Phone Number:
                          </TableCell>
                          <TableCell
                            sx={{
                              fontWeight: "700",
                              color: "green",
                              fontSize: "20px",
                              paddingTop: "30px",
                            }}
                          >
                            {profile.phone}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                    </Table>

                    <Button
                      variant="contained"
                      sx={{ margin: "40px 2px 0px 20px" }}
                      onClick={() => navigate(`/editprofile/${id}`)}
                    >
                      Edit
                    </Button>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          ) : null}
        </>
      )}
    </>
  );
};

export default Profile;
