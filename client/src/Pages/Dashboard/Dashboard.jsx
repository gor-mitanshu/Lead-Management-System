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

const Dashboard = () => {
  const [id, setId] = useState();
  const [role, setRole] = useState();
  let [leads, setLeads] = useState([]);
  let [client, setClient] = useState([]);
  var monthLeadChart = {
    labels: [],
    datasets: [
      {
        label: "Total Last Month Leads",
        data: [],
        backgroundColor: ["#202c70", "#f8c12b", "#dc3546", "#29a744"],
        hoverOffset: 2,
        // borderColor: "black",
        // borderWidth: 2,
      },
    ],
  };

  var YearleadChart = {
    labels: [],
    datasets: [
      {
        label: "Total Last Year Leads",
        data: [],
        backgroundColor: ["#202c70", "#f8c12b", "#dc3546", "#29a744"],
        hoverOffset: 2,
        // borderColor: "black",
        // borderWidth: 2,
      },
    ],
  };

  let [TotalLastMonthleads, setTotalLastMonthleads] = useState(monthLeadChart);
  let [TotalLastYearleads, setTotalLastYearleads] = useState(YearleadChart);

  const getEmpEnquiry = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/getempenq/${id}`)
      .then((response) => {
        setLeads(response.data.data);
        setTotalLastMonthleads(getLastMonthLeads(response.data.data));
        setTotalLastYearleads(getYearLeads(response.data.data));
      });
  };

  const getEnqData = async () => {
    await axios
      .get(`${process.env.REACT_APP_API}/api/getenquiries`)
      .then((response) => {
        setLeads(response.data.data);
        const unique = response.data.data.filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.email === value.email)
        );
        console.log(unique);

        setClient(unique);
        setTotalLastMonthleads(getLastMonthLeads(response.data.data));
        setTotalLastYearleads(getYearLeads(response.data.data));
      });
  };

  // const getEmpClient = async () => {
  //   await axios
  //     .get(`${process.env.REACT_APP_API}/getempclient/${id}`)
  //     .then((res) => {
  //       setClient(res.data.data);
  //     });
  // };

  // const getClientData = async () => {
  //   let response = await axios.get(
  //     `${process.env.REACT_APP_API}/api/getclients`
  //   );
  //   if (response.status === 200) {
  //     setClient(response.data.data);
  //   }
  // };

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
          // borderColor: "black",
          // borderWidth: 2,
        },
      ],
    };
  };

  const getYearLeads = (yearData) => {
    var date = new Date();
    var firstYear = new Date(date.getFullYear(), date.getMonth(), 1);
    // var lastYear = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let currentYear = firstYear;
    let dateArray = [];
    let data = [];

    let i = 0;
    let currentDate = new Date();
    for (i; i < 12; i++) {
      dateArray.push(`${i + 1}/${currentDate.getFullYear()}`);
      // eslint-disable-next-line no-loop-func
      let lastYearLeads = yearData.filter((e) => {
        return (
          new Date(e.createdAt).getMonth() === i &&
          currentDate.getFullYear() === currentYear.getFullYear()
        );
      }).length;
      data.push(lastYearLeads);
    }
    return {
      labels: dateArray,
      datasets: [
        {
          label: "Total Last Year Leads",
          data: data,
          hoverOffset: 2,
          // borderColor: "black",
          // borderWidth: 2,
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
      // getClientData();
    } else if (role === "employee") {
      getEmpEnquiry();
      // getEmpClient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, role]);

  return (
    <>
      <Grid container padding={2}>
        <Grid item container spacing={1} paddingBottom={3}>
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
                    {client.length}
                  </Typography>
                  <Typography variant="subtitle1" color="#fff" component="div">
                    Total Clients
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Grid item container spacing={2}>
          <Grid item lg={6} xs={12}>
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Bar
                style={{ height: "50vh !important" }}
                data={TotalLastMonthleads}
              />
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
              <Bar data={TotalLastYearleads} />
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
