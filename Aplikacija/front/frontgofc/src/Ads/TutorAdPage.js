import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import WindowPics from "../components/WindowPics";
import {
  createTheme,
  Button,
  Select,
  ThemeProvider,
  InputLabel,
  MenuItem,
  FormControl,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
const token = localStorage.getItem("token");

const TutorAdPage = () => {
  const [ads, setAds] = useState([]);
  const [pr, setPredmet] = useState([]);
  const [styleAlert, changeAlert] = useState("sakrij");
  const [predmeti, setPredmeti] = useState([]);

  const showAlert = () => {
    changeAlert("prikazi");
  };
  const hideAlert = () => {
    changeAlert("sakrij");
  };
  const [predid, setPredid] = useState("");
  const [pnaziv, setPnaziv] = useState("");

  const postaviPredmet = (e) => {
    setPredid(e.target.value);
    setPnaziv(predmeti.find((p) => p.id === e.target.value));
  };
  const getPredmeti = () => {
    axios
      .get("https://localhost:7048/api/DataView/ReturnAllSubjects")
      .then((res) => {
        console.log(res.data);
        setPredmet(res.data);
      });
  };

  const filter = (e) => {
    console.log(predid);
    e.preventDefault();
    axios
      .get(
        "https://localhost:7048/api/DataView/ViewAddByCertainFiltersForTutor/" +
          predid,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log(res);
        if (res.status != 202) {
          setAds(
            res.data.map((ad) => {
              return {
                datum: ad.datum,
                oid: ad.oid,
                username: ad.username,
                opis: ad.opis,
                tutorStudije: ad.tutorStudije,
                godinaStudija: ad.godinaStudija,
                predmet: ad.predmet,
              };
            })
          );
          hideAlert();
        } else {
          showAlert();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get("https://localhost:7048/api/DataView/ListAllAdsForTutors")
      .then((res) => {
        console.log(res);
        setAds(res.data);
        getPredmeti();
      });
  }, []);

  return (
    <section className="tutorad">
      <div id="boxBig">
        <div id="barBig">
          <span className="bartitleBig"></span>
          <WindowPics />
        </div>

        <div className="filters">
          <span className="adsfilterp">
            Odaberite kakve oglase za tutora želite da vidite:
          </span>
          <br />
          <br />
          <form id="formctrl" onSubmit={(e) => filter(e)}>
            <ThemeProvider theme={theme}>
              <InputLabel id="filtersb">Predmet</InputLabel>
              <Select
                labelId="filtersb"
                id="predmeti"
                variant="standard"
                label="Izaberite predmet"
                fullWidth
                value={predid}
                onChange={postaviPredmet}
              >
                {pr.map((p) => {
                  return (
                    <MenuItem key={p.id} value={p.id}>
                      {p.naziv}
                    </MenuItem>
                  );
                })}
              </Select>
              <br />
              <br />
              <Button
                id="filtriraj"
                size="small"
                variant="outlined"
                color="neutral"
                sx={{
                  fontWeight: "bold",
                  letterSpacing: 1,
                  fontSize: 15,
                }}
                type="submit"
                form="formctrl"
              >
                <SearchIcon /> Filtriraj
              </Button>
              <div className={styleAlert} id="nemaOglas">
                <Alert severity="error">Nema oglasa koje zahtevate!</Alert>
              </div>
            </ThemeProvider>
          </form>
        </div>

        {ads.map((ad) => {
          var datumic = new Date(ad.datum);
          const velikiDatum = `${datumic.getDate()}/${
            datumic.getMonth() + 1
          }/${datumic.getFullYear()}  ${datumic.getHours()}:${datumic.getMinutes()}`;

          return (
            <div className="card" key={ad.oid}>
              <div className="card-header">
                <Link to={`/ProfilePage/${ad.username}/${ad.role}`}>
                  {ad.username}
                </Link>
                <p> {velikiDatum}</p>
              </div>
              <div className="card-body">
                <div className="card-title">
                  <p>Predmet:{ad.predmet},</p>
                </div>
                <p>
                  Ja sam na te i te studije:
                  {ad.tutorStudije}
                </p>
                <p>A na godinu sam ovu: {ad.godinaStudija}</p>
                <br />
                <p>{ad.opis}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
export default TutorAdPage;
