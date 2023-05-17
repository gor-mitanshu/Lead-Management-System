import { AppBar, Grid, Toolbar, Typography } from "@mui/material";
import React, {
  // useEffect,
  useState,
} from "react";
import MenuIcon from "@mui/icons-material/Menu";
// import AdjustIcon from "@mui/icons-material/Adjust";

const NavBar = (props) => {
  // const [role, setRole] = useState();
  // useEffect(() => {
  //   const token = JSON.parse(localStorage.getItem("auth")).result.token;
  //   const data = JSON.parse(atob(token.split(".")[1])).admin;
  //   setRole(data.role);
  // }, []);

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
              className="toggle-btn"
              sx={{ cursor: "pointer", paddingRight: "16px", fontSize: "40px" }}
            />

            <Typography
              variant="h5"
              style={{ margin: "4px", fontWeight: "bold" }}
            >
              Lead Management System
            </Typography>

            {/* <Grid
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "4px",
                  color: "green",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                <AdjustIcon fontSize="small" />
                {role === "admin" ? <p>ADMIN</p> : <p>EMPLOYEE</p>}
              </Typography>
            </Grid> */}
          </Toolbar>
        </AppBar>
      </Grid>
    </>
  );
};

export default NavBar;
