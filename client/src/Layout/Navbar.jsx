import { AppBar, Grid, Toolbar, Typography } from "@mui/material";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

const NavBar = (props) => {
  const [isOpen, setOpen] = useState(false);
  const toggleSidebar = () => {
    setOpen(!isOpen);
    props.toggle(isOpen);
  };
  return (
    <>
      <Grid className="nav-bar-content">
        <AppBar>
          <Toolbar
            style={{
              padding: "0",
              paddingLeft: "14px",
              background: "#fff",
              color: "#202c70",
            }}
          >
            <MenuIcon
              fontWeight="900"
              onClick={toggleSidebar}
              sx={{ cursor: "pointer", paddingRight: "16px", fontSize: "40px" }}
            />
            <Typography
              variant="h5"
              style={{ margin: "4px", fontWeight: "bold" }}
            >
              Lead Management System
            </Typography>
          </Toolbar>
        </AppBar>
      </Grid>
    </>
  );
};

export default NavBar;
