import { Dashboard, Person, RateReview } from "@mui/icons-material";

import KeyIcon from "@mui/icons-material/Key";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";
import {
  Divider,
  Grid,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "../index.css";
import useAuth from "../Pages/useAuth";

const SideBar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState();
  const [id, setId] = useState();
  const { logout } = useAuth();
  useEffect(() => {
    const accessToken = localStorage.getItem("auth");
    if (accessToken) {
      axios
        .get(`${process.env.REACT_APP_API}/api/profile`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
          setId(response.data.data._id);
          setRole(response.data.data.role);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  const Logout = () => {
    logout();
    localStorage.clear();
    navigate("/login", { replace: true });
    toast.success("Logout Successfully");
  };
  return (
    <>
      <Grid
        item
        lg={12}
        sx={{
          height: "100%",
          background: "#202c70",
          position: "relative",
          overflowY: "auto",
          overflowX: "hidden",
          color: "white",
        }}
        // className={role === "admin" ? "admin" : "employee"}
      >
        <Toolbar />
        <Divider />

        <Grid item lg={12} xs={3} sm={6}>
          <NavLink
            to="/dashboard"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <ListItem disablePadding className="sidebar-btn">
              <ListItemButton className="activebtn" sx={{ padding: "12px" }}>
                <ListItemIcon sx={{ color: "white" }}>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText
                  primary="Dashboard"
                  sx={{ whiteSpace: "nowrap" }}
                />
              </ListItemButton>
            </ListItem>
          </NavLink>
        </Grid>
        <Divider />

        <Grid item lg={12} xs={3} sm={6}>
          <NavLink
            to="/profile"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <ListItem disablePadding className="sidebar-btn">
              <ListItemButton className="activebtn" sx={{ padding: "12px" }}>
                <ListItemIcon sx={{ color: "white" }}>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
          </NavLink>
        </Grid>
        <Divider />

        {role === "admin" ? (
          <>
            <Grid item lg={12} xs={3} sm={6}>
              <NavLink
                to="/employees"
                style={{ textDecoration: "none", color: "#fff" }}
              >
                <ListItem disablePadding className="sidebar-btn">
                  <ListItemButton
                    className="activebtn"
                    sx={{ padding: "12px" }}
                  >
                    <ListItemIcon sx={{ color: "white" }}>
                      <GroupIcon />
                    </ListItemIcon>
                    <ListItemText primary="Employees" />
                  </ListItemButton>
                </ListItem>
              </NavLink>
            </Grid>
            <Divider />
          </>
        ) : null}

        <Grid item lg={12} xs={3} sm={6}>
          <NavLink
            to="/enquiry"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <ListItem disablePadding className="sidebar-btn">
              <ListItemButton className="activebtn" sx={{ padding: "12px" }}>
                <ListItemIcon sx={{ color: "white" }}>
                  <RateReview />
                </ListItemIcon>
                <ListItemText
                  primary="Enquiry List"
                  sx={{ whiteSpace: "nowrap" }}
                />
              </ListItemButton>
            </ListItem>
          </NavLink>
        </Grid>
        <Divider />

        <Grid item lg={12} xs={3} sm={6}>
          <NavLink
            to="/clients"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <ListItem disablePadding className="sidebar-btn">
              <ListItemButton className="activebtn" sx={{ padding: "12px" }}>
                <ListItemIcon sx={{ color: "white" }}>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText primary="Clients" />
              </ListItemButton>
            </ListItem>
          </NavLink>
        </Grid>
        <Divider />

        <Grid item lg={12} xs={3} sm={6}>
          <NavLink
            to={`/changepassword/${id}`}
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <ListItem disablePadding className="sidebar-btn">
              <ListItemButton
                className="activebtn"
                sx={{ padding: "12px" }}
                onClick={() => {
                  navigate(`/changepassword/${id}`);
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>
                  <KeyIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Change Password"
                  sx={{ whiteSpace: "nowrap" }}
                />
              </ListItemButton>
            </ListItem>
          </NavLink>
        </Grid>
        <Divider />

        <Grid item lg={12} xs={3} sm={6}>
          <ListItem
            disablePadding
            className="sidebar-btn logout"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <ListItemButton sx={{ padding: "12px" }} onClick={Logout}>
              <ListItemIcon sx={{ color: "white" }}>
                <LogoutIcon className=" logout" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </Grid>
        <Divider />
      </Grid>
    </>
  );
};

export default SideBar;
