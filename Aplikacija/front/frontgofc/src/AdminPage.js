import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Ads/AdPage.css";
import WindowPics from "./components/WindowPics";
import {
  FormControl,
  createTheme,
  ThemeProvider,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Button,
  Alert,
} from "@mui/material";
import { grey } from "@mui/material/colors";

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

const AdminPage = () => {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);

  //   const handleInput = (e) => {
  //     console.log(e.target.value);
  //   };
  const getBannedUsers = (e) => {
    e.preventDefault();

    axios
      .get("https://localhost:7048/api/Administrator/ListAllBanUsers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        setUsers(res.data);
      });
  };

  const getNotBannedUsers = (e) => {
    e.preventDefault();
    axios
      .get("https://localhost:7048/api/Administrator/ListAllNonBanUsers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        setUsers(res.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const banuj = (e) => {
    var usrnam = e.target.value;
    const korisnik = {
      username: usrnam,
    };
    console.log(korisnik);
    axios
      .put("https://localhost:7048/api/Administrator/BanUser", korisnik, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err.message));
  };
  const [prijave, setPrijave] = useState([]);
  const listPrijave = () => {
    axios
      .get("https://localhost:7048/api/Administrator/PrikaziSvePrijave")
      .then((res) => {
        console.log(res.data);
        setPrijave(res.data);
      });
  };
  const proverenaPrijava = (idPrijave) => {
    console.log(idPrijave);
    axios
      .delete(
        "https://localhost:7048/api/Administrator/ProvernaPrijava/" + idPrijave,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        // setPrijave((prijave) =>
        //   listPrijave((prijave) => prijave.prijavaId !== idPrijave)
        // );
      });
  };
  useEffect(() => {
    axios
      .get("https://localhost:7048/api/Administrator/ListAllUsers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data);
        setUsers(res.data);
      });
    listPrijave();
  }, []);
  return (
    <div>
      <div id="boxBig">
        <div id="barBig">
          <span className="bartitleBig"></span>
          <WindowPics />
        </div>

        <span className="adsfilterp">Odaberite:</span>
        <ThemeProvider theme={theme}>
          <RadioGroup
            row
            aria-labelledby="access-demo-row-radio-buttons-group-label"
            name="access-row-radio-buttons-group"
          >
            <FormControlLabel
              value="banned"
              id="rbBanned"
              control={
                <Radio
                  onChange={(e) => getBannedUsers(e)}
                  sx={{
                    color: grey[800],
                    "&.Mui-checked": {
                      color: grey[600],
                    },
                  }}
                />
              }
              label="Banovani korisnici"
            />
            <FormControlLabel
              id="rbNotBanned"
              value="notBanned"
              control={
                <Radio
                  onChange={(e) => getNotBannedUsers(e)}
                  sx={{
                    color: grey[800],
                    "&.Mui-checked": {
                      color: grey[600],
                    },
                  }}
                />
              }
              label="Nebanovani korisnici"
            />
          </RadioGroup>
        </ThemeProvider>
        {prijave.map((pr) => {
          return (
            <>
              <Alert severity="info" key={pr.prijavaId}>
                {pr.prijavljen}
                <p>Razlog:{pr.razlog},</p>
                <p>Prijavio:{pr.prijavio}</p>
                <ThemeProvider theme={theme}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="neutral"
                    className="idban"
                    value={pr.prijavaId}
                    sx={{
                      fontWeight: "bold",
                      letterSpacing: 1,
                      fontSize: 15,
                    }}
                    onClick={() => {
                      window.location.reload(false);
                      proverenaPrijava(pr.prijavaId);
                    }}
                  >
                    Provereno
                  </Button>
                </ThemeProvider>
              </Alert>
            </>
          );
        })}
        {users.map((usr) => {
          return (
            <div className="card" key={usr.username}>
              <div className="card-header">{usr.username}</div>
              <div className="card-body">
                <div className="card-title">
                  <p>Ime:{usr.ime},</p>
                </div>
                <p>
                  Prezime:
                  {usr.prezime}
                </p>

                <br />
              </div>
              {usr.banovan ? (
                <></>
              ) : (
                <>
                  <ThemeProvider theme={theme}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="neutral"
                      className="idban"
                      value={usr.username}
                      sx={{
                        fontWeight: "bold",
                        letterSpacing: 1,
                        fontSize: 15,
                      }}
                      onClick={(e) => banuj(e, "value")}
                    >
                      Banuj
                    </Button>
                  </ThemeProvider>
                </>
              )}
            </div>
          );
        })}
      </div>
      <br />
      <br />
    </div>
  );
};

export default AdminPage;
