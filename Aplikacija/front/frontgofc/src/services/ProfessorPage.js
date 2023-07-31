import React, { useState, useEffect } from "react";
import WindowPics from "../components/WindowPics";
import axios from "axios";
import "../Ads/AdPage.css";
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
const ProfessorPage = () => {
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
  const [ads, setAds] = useState([]);
  const [predmeti, setPredmeti] = useState([]);
  const [fakulteti, setFakulteti] = useState([]);
  const [predid, setPredid] = useState("");
  const [pnaziv, setPnaziv] = useState("");
  const [faxid, setFaxid] = useState("");
  const [fnaziv, setFnaziv] = useState("");
  const [disb, setDisb] = useState(true);
  const [styleAlert, changeAlert] = useState("sakrij");
  const showAlert = () => {
    changeAlert("prikazi");
  };
  const hideAlert = () => {
    changeAlert("sakrij");
  };
  const promeniDrop = () => {
    setDisb(false);
  };
  const postaviPredmet = (e) => {
    setPredid(e.target.value);
    setPnaziv(predmeti.find((p) => p.id === e.target.value));
  };
  const postaviFakultet = (e) => {
    setFaxid(e.target.value);
    setFnaziv(fakulteti.find((p) => p.id === e.target.value));
  };

  const getFakulteti = () => {
    axios.get("https://localhost:7048/api/DataView/ListAllColl").then((res) => {
      console.log(res.data);
      setFakulteti(res.data);
    });
  };

  const showCertCoures = (e) => {
    setFaxid(e.target.value);
    var fid = e.target.value;
    axios
      .get("https://localhost:7048/api/DataView/FiltersProfCours/" + fid)
      .then((res) => {
        console.log(res.data);
        setPredmeti(res.data);
      });
  };

  const filterProf = (e) => {
    setPredid(e.target.value);
    e.preventDefault();
    console.log(predid);
    axios
      .get(
        "https://localhost:7048/api/DataView/ViewProfByCertainFilters/" + predid
      )
      .then((res) => {
        console.log(res.status);
        if (res.status != 202) {
          setAds(
            res.data.map((ad) => {
              return {
                id: ad.id,
                username: ad.username,
                opis: ad.opis,
                nastavnoZvanje: ad.nastavnoZvanje,
                obrazovanje: ad.obrazovanje,
                role: ad.role,
              };
            })
          );
          hideAlert();
        } else {
          showAlert();
        }
      });
  };
  useEffect(() => {
    axios
      .get("https://localhost:7048/api/DataView/ReturnAllProfessors")
      .then((res) => {
        console.log(res);
        setAds(res.data);
        getFakulteti();
      });
  }, []);
  return (
    <div id="boxBig">
      <div id="barBig">
        <span className="bartitleBig"></span>

        <WindowPics />
      </div>
      <div className="filters">
        <form id="formctrl" onSubmit={(e) => filterProf(e)}>
          <span className="adsfilterp">Odaberite koji vam profesor treba:</span>

          <br />
          <br />
          <FormControl id="formctrl">
            <ThemeProvider theme={theme}>
              <InputLabel id="filtersbfac" htmlFor="fakulteti">
                Izaberite fakultet
              </InputLabel>
              <Select
                labelId="filtersbfac"
                id="fakulteti"
                variant="standard"
                label="Izaberite fakultet"
                fullWidth
                value={faxid}
                onChange={(e) => {
                  postaviFakultet(e);
                  showCertCoures(e);
                }}
              >
                {fakulteti.map((p) => {
                  return (
                    <MenuItem key={p.fid} value={p.fid} onClick={promeniDrop}>
                      {p.naziv}
                    </MenuItem>
                  );
                })}
              </Select>
            </ThemeProvider>
          </FormControl>
          <br />
          <br />
          <FormControl id="formctrl">
            <ThemeProvider theme={theme}>
              <InputLabel id="filtersb">Izaberite predmet</InputLabel>
              <Select
                labelId="filtersb"
                id="predmeti"
                variant="standard"
                label="Izaberite predmet"
                fullWidth
                value={predid}
                onChange={postaviPredmet}
                disabled={disb}
              >
                {predmeti.map((p) => {
                  return (
                    <MenuItem key={p.pid} value={p.pid}>
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
                <SearchIcon /> Filtriraj
              </Button>
              <div className={styleAlert} id="nemaOglas">
                <Alert severity="error">Nema oglasa koje zahtevate!</Alert>
              </div>
            </ThemeProvider>
          </FormControl>
        </form>
      </div>
      {ads.map((ad) => {
        return (
          <div className="card" key={ad.id}>
            <div className="card-header">
              <Link to={`/ProfilePage/${ad.username}/${ad.role}`}>
                {ad.username}
              </Link>

              <p> </p>
            </div>
            <div className="card-body">
              <div className="card-title">
                <p></p>
              </div>
              <p>Opis: {ad.opis}</p>
              <p>Nastavno zvanje: {ad.nastavnoZvanje}</p>
              <p>Obrazovanje: {ad.obrazovanje}</p>
              <br />
              <p></p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProfessorPage;
