import { Delete, Edit, PersonAddAlt, Visibility } from "@mui/icons-material";
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

const Lead = () => {
  const [id, setId] = useState();
  const [role, setRole] = useState();
  const [enq, setEnq] = useState([]);
  const [isloading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getEmpLead = async () => {
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
          console.log(error.response.data.message);
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
        getEmpLead();
      }
    }, 650);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, role]);

  const onEnqDelete = async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API}/api/deleteenquiry/${id}`
      );
      if (res && res.data.success) {
        getEnqData();
        toast.success(res.data.message);
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
        <Grid container padding={2}>
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
              color="#202c70"
              variant="h3"
              paddingBottom={3}
            >
              Leads
            </Typography>
            {role === "admin" ? (
              <>
                <Link
                  to="/addlead"
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
                      <TableCell
                        sx={{
                          background: "black",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Status
                      </TableCell>

                      <TableCell
                        sx={{
                          background: "black",
                          color: "white",
                          textAlign: "center",
                        }}
                      >
                        Actions
                      </TableCell>
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
                        {role === "admin" ? (
                          <TableCell sx={{ textAlign: "center" }}>
                            {row.employeename}
                          </TableCell>
                        ) : null}
                        <TableCell sx={{ textAlign: "center" }}>
                          <Chip
                            label={row.status}
                            sx={{ width: "120px" }}
                            className={
                              row.status === "PENDING"
                                ? "pending"
                                : row.status === "COMPLETED"
                                ? "accepted"
                                : row.status === "REJECTED"
                                ? "rejected"
                                : ""
                            }
                            variant="contained"
                            size="medium"
                          />
                        </TableCell>

                        {role === "admin" ? (
                          <>
                            <TableCell
                              align="center"
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <IconButton
                                aria-label="edit"
                                color="inherit"
                                onClick={() => navigate(`/viewlead/${row._id}`)}
                              >
                                <Visibility />
                              </IconButton>
                              <IconButton
                                aria-label="edit"
                                color="info"
                                onClick={() => navigate(`/editlead/${row._id}`)}
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
                                onClick={() => navigate(`/viewlead/${row._id}`)}
                              >
                                <Visibility />
                              </IconButton>
                              <IconButton
                                aria-label="edit"
                                color="info"
                                onClick={() => navigate(`/editlead/${row._id}`)}
                              >
                                <Edit />
                              </IconButton>
                            </TableCell>
                          </>
                        )}
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

export default Lead;
