import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import "../../index.css";
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables, CategoryScale, ArcElement } from "chart.js";
import axios from "axios";
import { useEffect } from "react";
Chart.register(CategoryScale);
Chart.register(...registerables);
Chart.register(ArcElement);

var TotalLastMonthleads = {
  labels: [],
  datasets: [
    {
      label: "Total Last Month Leads",
      data: [],
      backgroundColor: ["#202c70", "#e300fc", "#920002", "#fdcccc"],
      hoverOffset: 2,
      borderColor: "black",
      borderWidth: 2,
    },
  ],
};
var TotalLastYearleads = {
  labels: [],
  datasets: [
    {
      label: "Total Last Month Leads",
      data: [],
      backgroundColor: ["#202c70"],
      hoverOffset: 2,
      borderColor: "black",
      borderWidth: 2,
    },
  ],
};

const Dashboard = () => {
  const [id, setId] = useState();
  const [role, setRole] = useState();
  let [leads, setLeads] = useState([]);
  let [client, setClient] = useState([]);

  const getEmpEnquiry = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/getempenq/${id}`)
      .then((response) => {
        setLeads(response.data.data);
        TotalLastMonthleads = getLastMonthLeads(response.data.data);
        TotalLastYearleads = getYearLeads(response.data.data);
      });
  };

  const getEnqData = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/api/getenquiries`)
      .then((response) => {
        setLeads(response.data.data);
        TotalLastMonthleads = getLastMonthLeads(response.data.data);
        TotalLastYearleads = getYearLeads(response.data.data);
      });
  };

  const getEmpClient = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/getempclient/${id}`)
      .then((res) => {
        setClient(res.data.data);
      });
  };

  const getClientData = async () => {
    let response = await axios.get(
      `${process.env.REACT_APP_API}/api/getclients`
    );
    if (response.status === 200) {
      setClient(response.data.data);
    }
  };

  const getMonthlyData = () => {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return leads.filter(
      (el) =>
        new Date(el.createdAt) >= firstDay && new Date(el.createdAt) <= lastDay
    ).length;
  };

  const getLastMonthLeads = (monthData) => {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
    let currentDate = firstDay;
    let dateArray = [];
    let data = [];
    while (currentDate <= lastDay) {
      dateArray.push(`${currentDate.getDate()}/${currentDate.getMonth() + 1}`);
      let lastMonthLeads = monthData.filter((e) => {
        return (
          new Date(e.createdAt).getDate() === currentDate.getDate() &&
          new Date(e.createdAt).getMonth() === currentDate.getMonth() &&
          new Date(e.createdAt).getFullYear() === currentDate.getFullYear()
        );
      }).length;
      data.push(lastMonthLeads);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return {
      labels: dateArray,
      datasets: [
        {
          label: "Total Last Month Leads",
          data: data,
          hoverOffset: 2,
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    };
  };

  const getYearLeads = (yearData) => {
    var date = new Date();
    var firstYear = new Date(date.getFullYear(), date.getMonth(), 1);
    console.log(firstYear);
    var lastYear = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    console.log(lastYear);

    let currentYear = firstYear;
    let dateArray = [];
    let data = [];
    while (currentYear <= lastYear) {
      dateArray.push(`${currentYear.getMonth()}/${currentYear.getFullYear()}`);
      let lastYearLeads = yearData.filter((e) => {
        debugger;
        return (
          new Date(e.createdAt).getMonth() === currentYear.getMonth() &&
          new Date(e.createdAt).getFullYear() === currentYear.getFullYear()
        );
      }).length;
      console.log(lastYearLeads);
      data.push(lastYearLeads);
      currentYear.setFullYear(currentYear.getFullYear() + 1);
    }
    console.log(dateArray);
    return {
      labels: dateArray,
      datasets: [
        {
          label: "Total Last Year Leads",
          data: data,
          hoverOffset: 2,
          borderColor: "black",
          borderWidth: 2,
        },
      ],
    };
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("auth")).result.token;
    const data = JSON.parse(atob(token.split(".")[1])).admin;
    const id = data._id;
    setId(id);
    setRole(data.role);
    if (role === "admin") {
      getEnqData();
      getClientData();
    } else if (role === "employee") {
      getEmpEnquiry();
      getEmpClient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, role]);

  return (
    <>
      <Grid container>
        <Grid item container spacing={1} sx={{ padding: "25px 10px" }}>
          <Grid item lg={2.4} md={6} sm={12} xs={12}>
            <Card
              sx={{
                background: "#202c70",
                color: "#fff",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent>
                  <Typography
                    component="div"
                    variant="h5"
                    sx={{ fontSize: "2rem" }}
                  >
                    {getMonthlyData()}
                  </Typography>
                  <Typography variant="subtitle1" color="#fff" component="div">
                    Total Current Month Leads
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>

          <Grid item lg={2.4} sm={6} xs={12}>
            <Card
              sx={{
                background: "#f8c12b",
                color: "#fff",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent>
                  <Typography
                    component="div"
                    variant="h5"
                    sx={{ fontSize: "2rem" }}
                  >
                    {leads.filter((e) => e.status === "PENDING").length}
                  </Typography>
                  <Typography variant="subtitle1" color="#fff" component="div">
                    Pending Leads
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>

          <Grid item lg={2.4} sm={6} xs={12}>
            <Card
              sx={{
                background: "#dc3546",
                color: "#fff",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent>
                  <Typography
                    component="div"
                    variant="h5"
                    sx={{ fontSize: "2rem" }}
                  >
                    {leads.filter((e) => e.status === "REJECTED").length}
                  </Typography>
                  <Typography variant="subtitle1" color="#fff" component="div">
                    Rejected Leads
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>

          <Grid item lg={2.4} sm={6} xs={12}>
            <Card
              sx={{
                background: "#29a744",
                color: "#fff",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent>
                  <Typography
                    component="div"
                    variant="h5"
                    sx={{ fontSize: "2rem" }}
                  >
                    {leads.filter((e) => e.status === "COMPLETED").length}
                  </Typography>
                  <Typography variant="subtitle1" color="#fff" component="div">
                    Completed Leads
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>

          <Grid item lg={2.4} sm={6} xs={12}>
            <Card
              sx={{
                background: "#f88961",
                color: "#fff",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CardContent>
                  <Typography
                    component="div"
                    variant="h5"
                    sx={{ fontSize: "2rem" }}
                  >
                    {client.filter((e) => e.role === "client").length}
                  </Typography>
                  <Typography variant="subtitle1" color="#fff" component="div">
                    Total Clients
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Grid item lg={12} container spacing={2} sx={{ padding: "20px 10px" }}>
          <Grid item lg={6} xs={12}>
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Bar data={TotalLastMonthleads} />
            </Card>
            <Typography>Monthly Enquires: </Typography>
          </Grid>

          <Grid item lg={6} xs={12}>
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Bar data={TotalLastYearleads} />
            </Card>
            <Typography>Yearly Enquires: </Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
