import {
  Delete,
  Edit,
  PersonAddAlt,
  ThumbDown,
  ThumbUp,
  Visibility,
} from "@mui/icons-material";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Loader from "../Loader";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../index.css";

const Enquiry = () => {
  const [id, setId] = useState();
  const [role, setRole] = useState();
  const [enq, setEnq] = useState([]);
  const [isloading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getEmpEnquiry = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/getempenq/${id}`)
      .then((res) => {
        setLoading(false);
        setEnq(res.data.data);
      });
  };

  const getEnqData = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/api/getenquiries`)
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          setEnq(response.data.data);
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
    const token = JSON.parse(localStorage.getItem("auth")).result.token;
    const data = JSON.parse(atob(token.split(".")[1])).admin;
    const id = data._id;
    setId(id);
    setRole(data.role);
    setLoading(true);
    setTimeout(() => {
      if (role === "admin") {
        getEnqData();
      } else if (role === "employee") {
        getEmpEnquiry();
      }
    }, 650);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, role]);

  const onEnqDelete = async (id) => {
    await axios
      .delete(`${process.env.REACT_APP_API}/api/deleteenquiry/${id}`)
      .then((response) => {
        if (response.status === 200) {
          getEnqData();
          toast.success("Lead Delete Successfully");
        } else {
          toast.error("Error in Deleting Client Lead");
        }
      });
  };

  const onAccept = async (id) => {
    await axios
      .put(`${process.env.REACT_APP_API}/api/acceptenquiry/${id}`)
      .then((response) => {
        if (response.status === 200) {
          getEmpEnquiry();
          toast.success("Lead Status Accepted");
        } else {
          toast.error("Something went wrong");
        }
      });
  };
  const onReject = async (id) => {
    await axios
      .put(`${process.env.REACT_APP_API}/api/rejectedenquiry/${id}`)
      .then((response) => {
        if (response.status === 200) {
          getEmpEnquiry();
          toast.error("Lead Status Rejected");
        } else {
          toast.error("Something went wrong");
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
        <Grid container padding={3}>
          <Grid
            item
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
            xs={12}
          >
            <Typography
              className="font"
              color="green"
              variant="h3"
              paddingBottom={3}
            >
              Enquiry Details
            </Typography>
            {role === "admin" ? (
              <>
                <Link
                  to="/addenquiry"
                  className="btn-link"
                  style={{ marginBottom: "24px" }}
                >
                  <Button variant="contained" color="primary">
                    <PersonAddAlt sx={{ paddingRight: "5px" }} /> Add Lead
                  </Button>
                </Link>
              </>
            ) : null}
          </Grid>

          <Grid item lg={12} sm={12} xs={11}>
            {enq.length <= 0 ? (
              <div style={{ textAlign: "center", color: "red" }}>
                <h1>* NO Lead DATA FOUND...</h1>
              </div>
            ) : (
              <TableContainer
                component={Paper}
                sx={{ overflow: "auto", maxHeight: "74vh" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          background: "black",
                          color: "white",
                          textAlign: "center",
                          width: "50px",
                        }}
                      >
                        Id
                      </TableCell>
                      <TableCell
                        sx={{
                          background: "black",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Name
                      </TableCell>
                      <TableCell
                        sx={{
                          background: "black",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        sx={{
                          background: "black",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Phone
                      </TableCell>
                      {/* <TableCell
                        sx={{
                          background: "black",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Company
                      </TableCell> */}
                      {role === "admin" ? (
                        <TableCell
                          sx={{
                            background: "black",
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          Assign to
                        </TableCell>
                      ) : null}

                      {/* <TableCell
                        sx={{
                          background: "black",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Enquiry
                      </TableCell> */}

                      <TableCell
                        sx={{
                          background: "black",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Actions
                      </TableCell>
                      {role === "employee" ? (
                        <TableCell
                          sx={{
                            background: "black",
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          Status
                        </TableCell>
                      ) : null}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {enq.map((row, key) => (
                      <TableRow key={key}>
                        <TableCell sx={{ textAlign: "center", width: "50px" }}>
                          {key + 1}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {row.firstname} {row.lastname}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {row.email}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          {row.phone}
                        </TableCell>
                        {/* <TableCell sx={{ textAlign: "center" }}>
                          {row.company}
                        </TableCell> */}
                        {role === "admin" ? (
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.employeename}
                          </TableCell>
                        ) : null}

                        {/* <TableCell sx={{ textAlign: "center" }}>
                          {row.enquiry}
                        </TableCell> */}

                        {role === "admin" ? (
                          <>
                            <TableCell align="center" sx={{ display: "flex" }}>
                              <IconButton
                                aria-label="edit"
                                color="inherit"
                                onClick={() =>
                                  navigate(`/viewenquiry/${row._id}`)
                                }
                              >
                                <Visibility />
                              </IconButton>
                              <IconButton
                                aria-label="edit"
                                color="info"
                                onClick={() =>
                                  navigate(`/editenquiry/${row._id}`)
                                }
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                color="error"
                                onClick={() => onEnqDelete(row._id)}
                              >
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell
                              align="center"
                              sx={{ display: "flex", justifyContent: "center" }}
                              className="d-flex"
                            >
                              <IconButton
                                aria-label="edit"
                                color="inherit"
                                onClick={() =>
                                  navigate(`/viewenquiry/${row._id}`)
                                }
                              >
                                <Visibility />
                              </IconButton>
                              <IconButton
                                aria-label="edit"
                                color="success"
                                onClick={() => onAccept(row._id)}
                              >
                                <ThumbUp />
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                color="error"
                                onClick={() => onReject(row._id)}
                              >
                                <ThumbDown />
                              </IconButton>
                            </TableCell>
                          </>
                        )}
                        {role === "employee" ? (
                          <TableCell
                            sx={{ textAlign: "center" }}
                            className={
                              row.status === "PENDING"
                                ? "pending"
                                : row.status === "COMPLETED"
                                ? "accepted"
                                : row.status === "REJECTED"
                                ? "rejected"
                                : ""
                            }
                          >
                            <Chip
                              label={row.status}
                              color={
                                row.status === "PENDING"
                                  ? "warning"
                                  : row.status === "COMPLETED"
                                  ? "success"
                                  : row.status === "REJECTED"
                                  ? "error"
                                  : ""
                              }
                              variant="contained"
                              size="small"
                            />
                          </TableCell>
                        ) : null}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Enquiry;
