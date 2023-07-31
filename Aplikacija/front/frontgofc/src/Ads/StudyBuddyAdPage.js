import React, { useEffect, useState } from "react";
import axios from "axios";
import WindowPics from "../components/WindowPics";
import { Link } from "react-router-dom";
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
const StudyBuddyAdPage = () => {
  const [ads, setAds] = useState([]);
  const [predmeti, setPredmeti] = useState([]);
  const [styleAlert, changeAlert] = useState("sakrij");

  const showAlert = () => {
    changeAlert("prikazi");
  };
  const hideAlert = () => {
    changeAlert("sakrij");
  };
  const getPredmeti = () => {
    axios
      .get("https://localhost:7048/api/DataView/ReturnAllSubjects")
      .then((res) => {
        setPredmeti(res.data);
      });
  };
  const filter = (e) => {
    e.preventDefault();
    axios
      .get(
        "https://localhost:7048/api/DataView/ViewAddByCertainFiltersForStuddyBuddy/" +
          predid
      )
      .then((res) => {
        if (res.status != 202) {
          setAds(
            res.data.map((ad) => {
              return {
                datum: ad.datum,
                oid: ad.oid,
                username: ad.username,
                opis: ad.opis,
                buddyStudije: ad.buddyStudije,
                godinaStudija: ad.godinaStudija,
                predmet: ad.predmet,
              };
            })
          );
          hideAlert();
        } else {
          showAlert();
        }
      });
  };
  const [predid, setPredid] = useState("");
  const [pnaziv, setPnaziv] = useState("");
  const postaviPredmet = (e) => {
    setPredid(e.target.value);
    setPnaziv(predmeti.find((p) => p.id === e.target.value));
  };
  useEffect(() => {
    axios
      .get("https://localhost:7048/api/DataView/ListAllAdsForStuddyBuddy")
      .then((res) => {
        setAds(res.data);
        getPredmeti();
      });
  }, []);

  return (
    <section className="studybuddyad">
      <div id="boxBig">
        <div id="barBig">
          <span className="bartitleBig"></span>
          <WindowPics />
        </div>
        <div className="filters">
          <form id="formctrl" onSubmit={(e) => filter(e)}>
            <span className="adsfilterp">
              Odaberite kakve oglase za study buddy-ja želite da vidite:
            </span>
            <br />
            <br />
            <ThemeProvider theme={theme}>
              <InputLabel id="filtersb">Izaberite predmet</InputLabel>
              <Select
                value={predid}
                labelId="filtersb"
                id="predmeti"
                variant="standard"
                label="Izaberite predmet"
                fullWidth
                onChange={postaviPredmet}
              >
                {predmeti.map((p) => {
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
              >
                <SearchIcon />
                Filtriraj
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
                ,<p> {velikiDatum}</p>
              </div>
              <div className="card-body">
                <div className="card-title">
                  <p>
                    Fakultet:{ad.fakultet}, Predmet:{ad.predmet}
                  </p>
                </div>
                <p>Coveci: {ad.buddyStudije}</p>
                <p>Godina studija: {ad.godinaStudija}</p>
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
export default StudyBuddyAdPage;
