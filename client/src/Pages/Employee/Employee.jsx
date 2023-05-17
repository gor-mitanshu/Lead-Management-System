import { Delete, Edit, PersonAddAlt } from "@mui/icons-material";
import {
  Button,
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
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Loader";

const Employee = () => {
  const navigate = useNavigate();
  const [emp, setEmp] = useState([]);
  const [isloading, setLoading] = useState(false);
  const getEmpData = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/api/getemployees`)
      .then((response) => {
        setLoading(false);
        if (response.status === 200) {
          setEmp(response.data.data);
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
      getEmpData();
    }, 650);
    localStorage.getItem("auth");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEmpDelete = async (id) => {
    await axios
      .delete(`${process.env.REACT_APP_API}/api/deleteemployee/${id}`)
      .then((response) => {
        if (response.status === 200) {
          getEmpData();
          toast.success(response.data.message);
        } else {
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
              Employees
            </Typography>
            <Link
              to="/addemployee"
              className="btn-link"
              style={{ marginBottom: "24px" }}
            >
              <Button variant="contained" color="primary">
                <PersonAddAlt sx={{ paddingRight: "5px" }} /> Add Employee
              </Button>
            </Link>
          </Grid>

          <Grid item lg={12} sm={12} xs={11}>
            {emp.length <= 0 ? (
              <div style={{ textAlign: "center", color: "red" }}>
                <h1>* NO EMPLOYEE DATA FOUND ...</h1>
              </div>
            ) : (
              <TableContainer
                component={Paper}
                sx={{ overflow: "auto", maxHeight: "75vh" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          background: "black",
                          color: "white",
                          textAlign: "center",
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
                    {emp.map((row, key) => (
                      <TableRow key={key}>
                        <TableCell sx={{ textAlign: "center" }}>
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

                        <TableCell
                          align="center"
                          sx={{ display: "flex", justifyContent: "center" }}
                        >
                          <IconButton
                            aria-label="edit"
                            color="info"
                            onClick={() => navigate(`/editemployee/${row._id}`)}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={() => onEmpDelete(row._id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
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

export default Employee;
