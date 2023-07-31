import React, { useState, useEffect } from "react";
import "./AdPage.css";
import axios from "axios";
import WindowPics from "../components/WindowPics";
import { Link } from "react-router-dom";
import {
  createTheme,
  Button,
  ThemeProvider,
  TextField,
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

const RoomateAdPage = () => {
  const [ads, setAds] = useState([]);
  const [styleAlert, changeAlert] = useState("sakrij");
  const [disb, setDisb] = useState(false, true);
  const [disbNum, setDisbNum] = useState(false, true);
  const promeniChecked = () => {
    setDisb(true);
  };
  const promenuNum = () => {
    setDisbNum(true);
  };
  const showAlert = () => {
    changeAlert("prikazi");
  };
  const hideAlert = () => {
    changeAlert("sakrij");
  };
  const filter = (e) => {
    e.preventDefault();
    var grad = e.target.grad.value;
    var brojcimera = e.target.brcim.value;
    var stanCb = e.target.stan;
    var nbtCm = e.target.nbt;
    var stan;
    if (stanCb.checked) {
      stan = true;
    } else {
      stan = false;
    }
    if (nbtCm.checked) {
      brojcimera = 1000;
    }
    axios
      .get(
        "https://localhost:7048/api/DataView/ViewAddByCertainFiltersForRoomeate/" +
          grad +
          "/" +
          brojcimera +
          "/" +
          stan
      )
      .then((res) => {
        console.log(res);
        if (res.status != 202) {
          setAds(res.data);
          hideAlert();
        } else {
          showAlert();
        }
      });
  };

  useEffect(() => {
    axios
      .get("https://localhost:7048/api/DataView/ListAllAdsForRoommate")
      .then((res) => {
        console.log(res);
        setAds(res.data);
      });
  }, []);

  return (
    <section className="roomatead">
      <div id="boxBig">
        <div id="barBig">
          <span className="bartitleBig"></span>
          <WindowPics />
        </div>

        <div className="filters">
          <form onSubmit={(e) => filter(e)}>
            <span className="adsfilterp">
              Odaberite kakve oglase za cimera želite da vidite:
            </span>

            <ThemeProvider theme={theme}>
              <TextField
                id="grad"
                label="Grad"
                variant="standard"
                size="small"
                fullWidth
              />
              <br />
              <br />
              <FormControlLabel
                control={<Checkbox id="stan" size="small" color="default" />}
                label="Tražite stan?"
              />
              <TextField
                id="brcim"
                onChange={promeniChecked}
                label="Broj cimera"
                type="number"
                disabled={disbNum}
                fullWidth
                InputProps={{
                  inputProps: { min: 0, max: 10 },
                }}
                variant="standard"
              />
              <br />
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    id="nbt"
                    size="small"
                    color="default"
                    disabled={disb}
                    onChange={promenuNum}
                  />
                }
                label="Broj cimera mi nije bitan"
              />

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

        <br />

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
                  <p>Grad:{ad.grad},</p>
                </div>
                <p>Imam stan: {ad.stan ? <span>Da</span> : <span>Ne</span>}</p>
                <p>Broj cimera: {ad.brojCimera}</p>
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
export default RoomateAdPage;
