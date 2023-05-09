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

var TotaLleads = {
  labels: [],
  datasets: [
    {
      label: "Leads",
      data: [],
      backgroundColor: ["#202c70"],
      hoverOffset: 2,
      borderColor: "black",
      borderWidth: 2,
    },
  ],
};

var PendingLeads = {
  labels: [],
  datasets: [
    {
      label: "Leads",
      data: [],
      backgroundColor: ["#29a744"],
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
      .then((res) => {
        setLeads(res.data.data);
      });
  };

  const getEnqData = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/api/getenquiries`)
      .then((response) => {
        setLeads(response.data.data);
        TotaLleads = getChartData(response.data.data);
        let pendingData = response.data.data.filter(
          (e) => e.status === "pending"
        );
        PendingLeads = getChartData(pendingData);
        console.log(PendingLeads, "PendingLeads");
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

  const getChartData = (chartData, pendingData) => {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let currentDate = firstDay;
    let dateArray = [];
    let dataArray = [];
    while (currentDate <= lastDay) {
      dateArray.push(
        `${currentDate.getDate()}/${currentDate.getMonth()}/${currentDate.getFullYear()}`
      );
      console.log(chartData);
      let todaysLeads = chartData.filter((e) => {
        return new Date(e.createdAt).getDate() === currentDate.getDate();
      }).length;
      dataArray.push(todaysLeads);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return {
      labels: dateArray,
      datasets: [
        {
          label: "leads",
          data: dataArray,
          hoverOffset: 2,
          borderColor: "black",
          // backgroundColor: ["#f8c12b", "#dc3546", "#29a744", "#202c70"],
          borderWidth: 2,
        },
      ],
    };
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
                    Total Month Leads
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
                    {leads.filter((e) => e.status === "pending").length}
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
                    {leads.filter((e) => e.status === "rejected").length}
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
                    {leads.filter((e) => e.status === "accepted").length}
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
              <Bar data={TotaLleads} />
            </Card>
          </Grid>

          <Grid item lg={6} xs={12}>
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Bar data={PendingLeads} />
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
