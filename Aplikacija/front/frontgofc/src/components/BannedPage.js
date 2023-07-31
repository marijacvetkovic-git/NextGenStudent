import React, { useState } from "react";
import "../services/utils.js";
import { getUsername } from "../services/utils.js";
import axios from "axios";
import "../ProfilePage.css";
import {
  FormLabel,
  Button,
  TextField,
  Backdrop,
  Fade,
  Box,
  Modal,
  ThemeProvider,
  InputLabel,
  IconButton,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import WindowPics from "../components/WindowPics";
const theme = createTheme({
  typography: {
    fontFamily: ["consolas"].join(","),
    fontSize: 12,
  },
  palette: {
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
  },
});
const BannedPage = () => {
  const [styleAlertReport, changeAlertReport] = useState("sakrij");
  const showAlertReport = () => {
    changeAlertReport("prikazi");
  };

  const usernam = window.location.href.split("/")[4];
  const token = localStorage.getItem("token");
  const u = getUsername();
  const ReportUser = (e) => {
    e.preventDefault();
    var razlogpr = e.target.razlog.value;
    const prijava = {
      razlog: razlogpr,
      usernamePrijavljenog: usernam,
      usernameKoJe: u,
    };
    console.log(prijava);
    axios
      .post(
        "https://localhost:7048/api/Administrator/PrijaviKorisnika/",
        prijava,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        console.log(prijava);
        showAlertReport();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div id="boxRAndL">
      <div id="barRAndL">
        <span className="bartitle">Banovanje</span>
        <WindowPics />
      </div>
      <form onSubmit={(e) => ReportUser(e)}>
        <ThemeProvider theme={theme}>
          <FormLabel id="dodaj-prijavu">
            Popunite informacije o prijavi
          </FormLabel>
          <TextField
            id="razlog"
            fullWidth
            label="Unesite razlog prijave:"
            variant="standard"
            size="small"
            multiline
            minRows={5}
          />
          <br />
          <br />
          <Button
            id="bReportSend"
            size="small"
            variant="outlined"
            color="neutral"
            fullWidth
            sx={{
              fontWeight: "bold",
              letterSpacing: 1,
              fontSize: 15,
            }}
            type="submit"
          >
            Pošalji prijavu
          </Button>
        </ThemeProvider>
        <div className={styleAlertReport} id="uspesnaPrijava">
          <Alert severity="info">Vaša prijava je poslata na razmatranje!</Alert>
        </div>
      </form>
    </div>
  );
};

export default BannedPage;
