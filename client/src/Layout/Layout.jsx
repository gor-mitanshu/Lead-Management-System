import { Grid } from "@mui/material";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";
import SideBar from "./Sidebar";

const Layout = () => {
  const [isOpen, setIsClose] = useState(true);

  const toggleSidebar = (data) => {
    setIsClose(data);
  };

  return (
    <>
      <Grid sx={{ display: "flex", height: "100vh" }}>
        <Grid className={isOpen ? "sidebar" : "sidebar-sm"}>
          <SideBar isToogle={isOpen} />
        </Grid>
        <Grid style={{ width: "100%" }}>
          <Grid className="nav-bar">
            <NavBar toggle={toggleSidebar} />
          </Grid>
          <div
            style={{
              width: "100%",
              height: "calc(100vh - 68px)",
              overflow: "auto",
            }}
          >
            <Outlet />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Layout;
