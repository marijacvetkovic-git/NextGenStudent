import React, { useState, useEffect } from "react";
import "./HomePage.css";
import { getUserId, getRole, getUsername } from "./services/utils";
import axios from "axios";
import WindowPics from "./components/WindowPics";
import {
  MenuItem,
  InputLabel,
  Select,
  ThemeProvider,
  TextField,
  RadioGroup,
  Radio,
  Button,
  Checkbox,
  FormControlLabel,
  FormLabel,
  Modal,
  Backdrop,
  Fade,
  Box,
  Alert,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
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

const HomePage = () => {
  const token = localStorage.getItem("token");
  const username = getUsername();
  //
  // const ex = getExp();
  // const vreme = new Date().toLocaleString();
  // console.log(ex);
  // console.log(vreme);
  // if (ex >= vreme) {
  //   window.localStorage.removeItem(token);
  //   window.location = "/Register&LoginPage";
  // }
  //
  const [idSB, setIdSB] = useState(null);
  const [idT, setIdT] = useState(null);
  const [stRoomate, changeAdRoomate] = useState("sakrij", "prikazi");
  const [stStuddyBuddy, changeAdSB] = useState("sakrij", "prikazi");
  const [stTutor, changeAdTutor] = useState("sakrij", "prikazi");
  //----------------------------
  const [open, setOpen] = useState(false);
  const [openSB, setOpenSB] = useState(false);
  const [openT, setOpenT] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpenSB = () => setOpenSB(true);
  const handleOpenT = () => setOpenT(true);
  const handleClose = () => setOpen(false);
  const handleCloseSB = () => setOpenSB(false);
  const handleCloseT = () => setOpenT(false);
  //-------------------------------
  const [ads, setAds] = useState([]);
  // const [adssb, setAdsSB] = useState([]);
  // const [adstut, setAdsTut] = useState([]);
  const [predmet, setPredmet] = useState([]);
  const [styleAlert, changeAlert] = useState("sakrij");

  const showAlert = () => {
    changeAlert("prikazi");
  };
  const hideAlert = () => {
    changeAlert("sakrij");
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    borderRadius: "4px",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };
  const [fakulteti, setFakulteti] = useState([]);
  const getPredmeti = (imeFakulteta) => {
    axios
      .get("https://localhost:7048/api/DataView/ReturnAllSubjects")
      .then((res) => {
        console.log(imeFakulteta);

        console.log(res.data);
        setPredmet(res.data.filter((p) => p.fakultet === imeFakulteta));
      });
  };
  const getFakulteti = () => {
    axios
      .get("https://localhost:7048/api/DataView/GetAllColByStudent/" + username)
      .then((res) => {
        setFakulteti(res.data);
      });
  };
  const [predid, setPredid] = useState("");
  const [pnaziv, setPnaziv] = useState("");
  const postaviPredmet = (e) => {
    setPredid(e.target.value);
    setPnaziv(predmet.find((p) => p.id === e.target.value));
  };
  const [fakultetid, setFakultetid] = useState("");
  const [fnaziv, setFnaziv] = useState("");
  const postaviFakultet = (e) => {
    setFakultetid(e.target.value);
    console.log(e.target.value);

    const imeF = fakulteti.find(
      (p) => p.fakultetId === e.target.value
    ).fakultetNaziv;
    getPredmeti(imeF);
    setFnaziv(imeF);
  };
  const [id, setId] = useState(null);
  useEffect(() => {
    getFakulteti();
  }, []);

  const showRoomate = () => {
    changeAdRoomate("prikazi");
    changeAdSB("sakrij");
    changeAdTutor("sakrij");
  };
  const showSB = () => {
    changeAdSB("prikazi");
    changeAdRoomate("sakrij");
    changeAdTutor("sakrij");
  };
  const showTutor = () => {
    changeAdTutor("prikazi");
    changeAdSB("sakrij");
    changeAdRoomate("sakrij");
  };
  const postAd = (e) => {
    e.preventDefault();
    var cimerr = e.target.rbHomeC;
    var sb = e.target.rbHomeSB;
    var tut = e.target.rbHomeT;
    var grad = e.target.fadcity.value;
    var cimer = parseInt(e.target.fadcim.value);
    var stan = e.target.fadstan;
    var stanic;
    var godstsb = e.target.fadgodstudija.value.toString();
    var opissb = e.target.placeForAdSB.value;
    var predmettut = e.target.fadpredmettut;
    var gossttut = e.target.fadgodstudtut.value.toString();
    var opistut = e.target.placeForAdTut.value;
    var rba = document.getElementById("rbachelors");
    var rbm = document.getElementById("rbmasters");
    var rbas = document.getElementById("rbachelorss");
    var rbms = document.getElementById("rbmasterss");
    var datum = new Date();
    var iduser = parseInt(getUserId());

    if (stan.checked) {
      stanic = true;
    } else {
      stanic = false;
    }
    var opis = e.target.placeForAd.value;
    const coglas = {
      studentId: iduser,
      datum: datum,
      opis: opis,
      stan: stanic,
      grad: grad,
      brojCimera: cimer,
    };
    console.log(coglas);
    if (cimerr.checked) {
      axios
        .post(
          "https://localhost:7048/api/Student/CreateNewAdForRoommate",
          coglas,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((resp) => {
          console.log("Getting from:", resp.coglas);
          hideAlert();
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else if (sb.checked) {
      var l;
      if (rba.checked) {
        l = 0;
      } else if (rbm.checked) {
        l = 1;
      } else {
        l = 2;
      }
      const sboglas = {
        studentId: iduser,
        predmetId: predid,
        datum: datum,
        opis: opissb,
        godinaStudija: godstsb,
        buddyStudije: l,
      };
      console.log(sboglas);
      axios
        .post(
          "https://localhost:7048/api/Student/CreateNewAdStuddyBuddy",
          sboglas,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((resp) => {
          console.log("Getting from:", resp.sboglas);
          hideAlert();
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else if (tut.checked) {
      var l;
      if (rbas.checked) {
        l = 0;
      } else if (rbms.checked) {
        l = 1;
      } else {
        l = 2;
      }

      const tutoglas = {
        studentId: iduser,
        predmetId: predid,
        datum: datum,
        opis: opistut,
        tutorStudije: l,
        godinaStudija: gossttut,
      };
      console.log(iduser, opistut, datum, predmettut, l, gossttut);

      axios
        .post("https://localhost:7048/api/Student/CreateNewAdTutor", tutoglas, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((resp) => {
          console.log("Getting from:", resp.tutoglas);
          hideAlert();
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  };
  var iduser = getUserId();

  const getAdRoom = (e) => {
    e.preventDefault();
    axios
      .get(
        "https://localhost:7048/api/DataView/ListAllAdsRoommateByStudent/" +
          iduser
      )
      .then((res) => {
        console.log(res.status);
        console.log(res);
        if (res.status === 200) {
          setAds(
            res.data.map((ad) => {
              return {
                oid: ad.oid,
                grad: ad.grad,
                brojCimera: ad.brojCimera,
                opis: ad.opis,
                stan: ad.stan,
                datum: ad.datum,
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
  const getAdSB = (e) => {
    var st;
    axios
      .get(
        "https://localhost:7048/api/DataView/ListAllAdsStuddyBuddyByStudent/" +
          iduser
        // { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log(res);
        if (res.status !== 202) {
          setAds(
            res.data.map((ad) => {
              if (ad.buddyStudije == 0) {
                st = "Osnovne";
              } else if (ad.buddyStudije == 1) {
                st = "Master";
              } else {
                st = "Doktorske";
              }
              return {
                oid: ad.oid,
                buddyStudije: st,
                godinaStudija: ad.godinaStudija,
                predmetId: ad.predmetId,
                predmetBuddy: ad.predmetBuddy,
                opis: ad.opis,
                datum: ad.datum,
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
  const getAdTut = (e) => {
    var st;
    axios
      .get(
        "https://localhost:7048/api/DataView/ListAllAdsTutorByStudent/" + iduser
      )
      .then((res) => {
        console.log(res);
        if (res.status !== 202) {
          setAds(
            res.data.map((ad) => {
              if (ad.tutorStudije == 0) {
                st = "Osnovne";
              } else if (ad.tutorStudije == 1) {
                st = "Master";
              } else {
                st = "Doktorske";
              }
              return {
                oid: ad.oid,
                tutorStudije: st,
                godinaStudija: ad.godinaStudija,
                predmetTutor: ad.predmetTutor,
                opis: ad.opis,
                datum: ad.datum,
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

  const deleteAdRoom = (idOglasa) => {
    axios
      .delete("https://localhost:7048/api/Student/DeleteAd/" + idOglasa, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);

        setAds((ads) => ads.filter((ad) => ad.oid !== idOglasa));
      });
  };
  //--------------------------------
  const changeAd = (e) => {
    e.preventDefault();
    var brojCimeraUpdate = parseInt(e.target.brcUpdate.value);
    var opisUpdate = e.target.opUpdate.value;
    console.log(brojCimeraUpdate, opisUpdate, id);
    var gradUpdate = e.target.gradUpdate.value;
    var stanUpdate = e.target.stanUpdate;
    console.log(stanUpdate.value);
    var su;
    if (stanUpdate.checked) {
      su = true;
    } else {
      su = false;
    }
    console.log(e.target.gradUpdate);
    const ad = {
      oid: id,
      grad: gradUpdate,
      brojCimera: brojCimeraUpdate,
      opis: opisUpdate,
      stan: su,
    };
    axios
      .put("https://localhost:7048/api/Student/UpdateAdRoommate/", ad, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        const index = ads.findIndex((ad) => ad.oid === id);
        const updatedAds = [...ads];
        updatedAds[index] = ad;
        setAds(updatedAds);
        console.log(ads);
        handleClose();
      });
  };

  const changeAdStuddy = (e) => {
    e.preventDefault();
    var rba = e.target.rbachelors;
    var rbm = e.target.rbmasters;
    var ll;
    var godinaStudijaSBUpdate = e.target.godinaStudijaSBUpdate.value;
    if (rba.checked) {
      ll = 0;
    } else if (rbm.checked) {
      ll = 1;
    } else {
      ll = 2;
    }
    var opisUpdate = e.target.opisUpdate.value;
    const ad = {
      oid: idSB,
      buddyStudije: ll,
      godinaStudija: godinaStudijaSBUpdate,
      predmetId: predid,
      opis: opisUpdate,
    };
    console.log(ad);
    axios
      .put("https://localhost:7048/api/Student/UpdateAdStuddyBuddy2", ad, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res.data);
        const index = ads.findIndex((ad) => ad.oid === idSB);
        ad.datum = res.data.datum;
        ad.predmetBuddy = res.data.naziv;
        const updatedAds = [...ads];
        updatedAds[index] = ad;
        setAds(updatedAds);
        handleClose();
      });
  };
  const changeAdT = (e) => {
    e.preventDefault();
    var godinaStudijaTUpdate = parseInt(e.target.godinaStudijaTUpdate.value);

    var rba = e.target.rbachelorss;
    var rbm = e.target.rbmasterss;
    var opisUpdate = e.target.opUpdate.value;
    var ll;
    if (rba.checked) {
      ll = 0;
    } else if (rbm.checked) {
      ll = 1;
    } else {
      ll = 2;
    }
    const ad = {
      oid: idT,
      tutorStudije: ll,
      godinaStudija: godinaStudijaTUpdate,
      predmet: predid,
      opis: opisUpdate,
    };
    axios
      .put("https://localhost:7048/api/Student/UpdateAdTutor/", ad, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        const index = ads.findIndex((ad) => ad.oid === idT);
        ad.datum = res.data.datum;
        ad.predmetBuddy = res.data.naziv;
        const updatedAds = [...ads];
        updatedAds[index] = ad;
        setAds(updatedAds);
        console.log(ads);
        handleClose();
      });
  };

  //--------------------------------------------

  const [objava, setObjava] = useState({});
  const fillAdsR = (idOglasa) => {
    const ad = ads.find((ad) => ad.oid === idOglasa);
    if (ad) {
      const grad = ad.grad;
      const stan = ad.stan;
      const brCim = ad.brojCimera;
      setObjava({
        oid: ad.oid,
        desc: ad.opis,
        apr: stan,
        cimm: brCim,
        city: grad,
      });
    }
  };
  const fillAdsSB = (idOglasa) => {
    const ad = ads.find((ad) => ad.oid === idOglasa);
    if (ad) {
      const BStudije = ad.buddyStudije;
      var m;
      if (BStudije === "Osnovne") {
        m = 0;
      }
      if (BStudije === "Master") {
        m = 1;
      }
      if (BStudije === "Doktorske") m = 2;
      axios
        .get("https://localhost:7048/api/DataView/ReturnAllSubjects")
        .then((res) => {
          const predmet = res.data.find((p) => p.id === ad.predmetId);
          const fid = fakulteti.find(
            (f) => f.fakultetNaziv === predmet.fakultet
          ).fakultetId;
          setFakultetid(fid);
          getPredmeti(predmet.fakultet);
          setPredid(ad.predmetId);
          console.log(predmet, fid, ad.predmetId, fakulteti);

          setObjava({
            oid: ad.oid,
            desc: ad.opis,
            tipBuddy: m,
            godStBuddy: ad.godinaStudija,
            predmetBuddy: predmet.id,
          });
        });

      console.log(ad);
    }
  };
  const fillAdsT = (idOglasa) => {
    const ad = ads.find((ad) => ad.oid === idOglasa);
    if (ad) {
      const TStudije = ad.tutorStudije;
      const godStudije = ad.godinaStudija;
      var m;
      if (TStudije === "Osnovne") {
        m = 0;
      }
      if (TStudije === "Master") {
        m = 1;
      }
      if (TStudije === "Doktorske") m = 2;

      setObjava({
        oid: ad.oid,
        desc: ad.opis,
        tiptut: TStudije,
        gods: godStudije,
      });
    }
  };

  //-------------------------------------------
  var r = getRole();
  const t = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (t === null) navigate("/RegisterAndLoginPage", { replace: true });
  }, [t]);

  return (
    <>
      {r === "Student" ? (
        <section className="HomePage">
          <div id="boxBig">
            <div id="barBig">
              <span className="bartitleBig"></span>
              <WindowPics />
            </div>
            <div className="divad" id="centriraj">
              <form id="publishRoomateAd" onSubmit={(e) => postAd(e)}>
                <div id="izaberiAd">
                  <ThemeProvider theme={theme}>
                    <FormLabel id="hp-demo-radio-buttons-group-label">
                      Izaberite tip oglasa koji želite da postavite
                    </FormLabel>
                    <RadioGroup
                      id="izboroglasa"
                      row
                      aria-labelledby="hp-access-demo-row-radio-buttons-group-label"
                      name="hp-access-row-radio-buttons-group"
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            value="cimer"
                            onClick={showRoomate}
                            id="rbHomeC"
                            sx={{
                              color: grey[800],
                              "&.Mui-checked": {
                                color: grey[600],
                              },
                            }}
                          />
                        }
                        label="Cimer"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            value="sb"
                            id="rbHomeSB"
                            onClick={showSB}
                            sx={{
                              color: grey[800],
                              "&.Mui-checked": {
                                color: grey[600],
                              },
                            }}
                          />
                        }
                        label="Study Buddy"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            value="tutor"
                            id="rbHomeT"
                            onClick={showTutor}
                            sx={{
                              color: grey[800],
                              "&.Mui-checked": {
                                color: grey[600],
                              },
                            }}
                          />
                        }
                        label="Tutor"
                      />
                    </RadioGroup>
                  </ThemeProvider>
                </div>
                <div className={stRoomate}>
                  <ThemeProvider theme={theme}>
                    <TextField
                      id="fadcity"
                      fullWidth
                      label="Unesite grad"
                      variant="standard"
                      size="small"
                    />
                    <br />
                    <TextField
                      id="fadcim"
                      label="Unesite koliko cimera tražite"
                      type="number"
                      fullWidth
                      InputProps={{
                        inputProps: { min: 0, max: 10 },
                      }}
                      variant="standard"
                    />
                    <br />
                    <FormControlLabel
                      control={
                        <Checkbox id="fadstan" size="small" color="default" />
                      }
                      label="Imam stan"
                    />
                    <br />
                    <TextField
                      multiline
                      id="placeForAd"
                      label="Unesite opis oglasa"
                      size="small"
                      fullWidth
                      variant="outlined"
                      minRows={5}
                    />
                    <br />
                    <br />
                    <Button
                      id="bobjavi"
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
                      Objavi
                    </Button>
                  </ThemeProvider>
                </div>
                <div className={stStuddyBuddy}>
                  <ThemeProvider theme={theme}>
                    <FormLabel id="sbstudies-row-radio-buttons-group-label">
                      Tip studija
                    </FormLabel>
                    <RadioGroup
                      defaultValue="Osnovne"
                      row
                      aria-labelledby="sbstudies-row-radio-buttons-group-label"
                      name="studies-sbrow-radio-buttons-group"
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            value="Osnovne"
                            id="rbachelors"
                            sx={{
                              color: grey[800],
                              "&.Mui-checked": {
                                color: grey[600],
                              },
                            }}
                          />
                        }
                        label="Osnovne"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            value="Master"
                            id="rbmasters"
                            sx={{
                              color: grey[800],
                              "&.Mui-checked": {
                                color: grey[600],
                              },
                            }}
                          />
                        }
                        label="Master"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            value="Doktorske"
                            id="rbphds"
                            sx={{
                              color: grey[800],
                              "&.Mui-checked": {
                                color: grey[600],
                              },
                            }}
                          />
                        }
                        label="Doktorske"
                      />
                    </RadioGroup>
                    <InputLabel id="addadsb">Izaberite fakultet</InputLabel>
                    <Select
                      labelId="addadsb"
                      id="fadpredmetsb"
                      variant="standard"
                      label="Izaberite predmet"
                      fullWidth
                      value={fakultetid}
                      onChange={postaviFakultet}
                    >
                      {Array.isArray(fakulteti) && fakulteti.length ? (
                        fakulteti.map((p) => {
                          return (
                            <MenuItem key={p.fakultetId} value={p.fakultetId}>
                              {p.fakultetNaziv}
                            </MenuItem>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </Select>
                    <InputLabel id="addadsb">Izaberite predmet</InputLabel>
                    <Select
                      labelId="addadsb"
                      id="fadpredmetsb"
                      variant="standard"
                      label="Izaberite predmet"
                      fullWidth
                      value={predid}
                      onChange={postaviPredmet}
                    >
                      {predmet.map((p) => {
                        return (
                          <MenuItem key={p.id} value={p.id}>
                            {p.naziv}
                          </MenuItem>
                        );
                      })}
                    </Select>

                    <TextField
                      id="fadgodstudija"
                      label="Godina studija"
                      type="number"
                      fullWidth
                      InputProps={{
                        inputProps: { min: 1, max: 5 },
                      }}
                      variant="standard"
                    />
                    <br />
                    <br />
                    <TextField
                      multiline
                      id="placeForAdSB"
                      label="Unesite opis oglasa"
                      size="small"
                      fullWidth
                      variant="outlined"
                      minRows={5}
                    />
                    <br />
                    <br />
                    <Button
                      id="bobjavi"
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
                      Objavi
                    </Button>
                  </ThemeProvider>
                </div>
                <div className={stTutor}>
                  <ThemeProvider theme={theme}>
                    <FormLabel id="tstudies-row-radio-buttons-group-label">
                      Tip studija
                    </FormLabel>
                    <RadioGroup
                      defaultValue="Osnovne"
                      row
                      aria-labelledby="tstudies-row-radio-buttons-group-label"
                      name="tstudies-brow-radio-buttons-group"
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            value="Osnovne"
                            id="rbachelorss"
                            sx={{
                              color: grey[800],
                              "&.Mui-checked": {
                                color: grey[600],
                              },
                              marginLeft: "1rem",
                            }}
                          />
                        }
                        label="Osnovne"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            value="Master"
                            id="rbmasterss"
                            sx={{
                              color: grey[800],
                              "&.Mui-checked": {
                                color: grey[600],
                              },
                            }}
                          />
                        }
                        label="Master"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            value="Doktorske"
                            id="rbphdss"
                            sx={{
                              color: grey[800],
                              "&.Mui-checked": {
                                color: grey[600],
                              },
                            }}
                          />
                        }
                        label="Doktorske"
                      />
                    </RadioGroup>
                    <InputLabel id="addadsb">Izaberite fakultet</InputLabel>
                    <Select
                      labelId="addadsb"
                      id="fadpredmetsb"
                      variant="standard"
                      label="Izaberite predmet"
                      fullWidth
                      value={fakultetid}
                      onChange={postaviFakultet}
                    >
                      {Array.isArray(fakulteti) && fakulteti.length ? (
                        fakulteti.map((p) => {
                          return (
                            <MenuItem key={p.fakultetId} value={p.fakultetId}>
                              {p.fakultetNaziv}
                            </MenuItem>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </Select>
                    <InputLabel id="addadsb">Izaberite predmet</InputLabel>
                    <Select
                      labelId="addadsb"
                      id="fadpredmetsb"
                      variant="standard"
                      label="Izaberite predmet"
                      fullWidth
                      value={predid}
                      onChange={postaviPredmet}
                    >
                      {predmet.map((p) => {
                        return (
                          <MenuItem key={p.id} value={p.id}>
                            {p.naziv}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    <TextField
                      id="fadgodstudtut"
                      label="Godina studija"
                      type="number"
                      fullWidth
                      InputProps={{
                        inputProps: { min: 1, max: 5 },
                      }}
                      variant="standard"
                    />
                    <br />
                    <br />
                    <TextField
                      multiline
                      fullWidth
                      id="placeForAdTut"
                      label="Unesite opis oglasa"
                      size="small"
                      variant="outlined"
                      minRows={5}
                    />
                    <br />
                    <br />
                    <Button
                      id="bobjavi"
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
                      Objavi
                    </Button>
                  </ThemeProvider>
                </div>
              </form>
            </div>
            <div id="centriraj" className="AdNavi">
              <ThemeProvider theme={theme}>
                <FormLabel id="og-demo-radio-buttons-group-label">
                  Odaberite Vaše oglase koje želite da vidite:
                </FormLabel>
                <br />
                <br />
                <div id="oglasiprikazdugmici">
                  <Button
                    id="showurads1"
                    size="small"
                    variant="outlined"
                    color="neutral"
                    sx={{
                      fontWeight: "bold",
                      fontSize: 11,
                    }}
                    onClick={(e) => getAdRoom(e)}
                  >
                    cimer
                  </Button>

                  <Button
                    id="showurads2"
                    size="small"
                    variant="outlined"
                    color="neutral"
                    sx={{
                      fontWeight: "bold",
                      fontSize: 11,
                    }}
                    onClick={(e) => getAdSB(e)}
                  >
                    study buddy
                  </Button>

                  <Button
                    id="showurads3"
                    size="small"
                    variant="outlined"
                    color="neutral"
                    sx={{
                      fontWeight: "bold",
                      fontSize: 11,
                    }}
                    onClick={(e) => getAdTut(e)}
                  >
                    tutor
                  </Button>
                </div>
              </ThemeProvider>
            </div>
            <div className={styleAlert} id="nemaOglas">
              <Alert severity="error">Niste objavili ovakve oglase!</Alert>
            </div>

            {ads.map((ad) => {
              var datumic = new Date(ad.datum);
              const velikiDatum = `${datumic.getDate()}/${
                datumic.getMonth() + 1
              }/${datumic.getFullYear()}  ${datumic.getHours()}:${datumic.getMinutes()}`;
              return (
                <div className="nekiDiv" key={ad.oid}>
                  <div className="card">
                    <div className="card-header">{velikiDatum}</div>
                    <div className="card-body">
                      <div className="card-title">
                        {ad.grad ? (
                          <>
                            <p>Grad:{ad.grad},</p>
                            <p>
                              Imam stan:
                              {ad.stan ? <span>Da</span> : <span>Ne</span>}
                            </p>
                            <p>Broj cimera: {ad.brojCimera}</p>
                          </>
                        ) : (
                          <></>
                        )}
                        {ad.buddyStudije ? (
                          <>
                            <p>Tip studija: {ad.buddyStudije}</p>
                            <p>Godina studija: {ad.godinaStudija}</p>
                            <p>Predmet: {ad.predmetBuddy}</p>
                          </>
                        ) : (
                          <></>
                        )}
                        {ad.tutorStudije ? (
                          <>
                            <p>Tip studija : {ad.tutorStudije}</p>
                            <p>Godina studija: {ad.godinaStudija}</p>
                            <p>Predmet: {ad.predmetTutor}</p>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>

                      <br />
                      <p>{ad.opis}</p>
                    </div>
                  </div>
                  {ad.grad ? (
                    <div className="dugmad">
                      <ThemeProvider theme={theme}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="neutral"
                          sx={{
                            fontWeight: "bold",
                            fontSize: 11,
                          }}
                          onClick={() => {
                            setId(ad.oid);
                            fillAdsR(ad.oid);
                            handleOpen();
                          }}
                          type="submit"
                        >
                          Izmeni
                        </Button>

                        <br />
                        <br />
                        <Button
                          size="small"
                          variant="outlined"
                          color="neutral"
                          sx={{
                            fontWeight: "bold",
                            fontSize: 11,
                          }}
                          onClick={() => deleteAdRoom(ad.oid)}
                        >
                          Obriši
                        </Button>
                      </ThemeProvider>
                    </div>
                  ) : (
                    <></>
                  )}
                  {ad.buddyStudije ? (
                    <div className="dugmad">
                      <ThemeProvider theme={theme}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="neutral"
                          sx={{
                            fontWeight: "bold",
                            fontSize: 11,
                          }}
                          onClick={() => {
                            setIdSB(ad.oid);
                            fillAdsSB(ad.oid);
                            handleOpenSB();
                          }}
                          type="submit"
                        >
                          Izmeni
                        </Button>

                        <br />
                        <br />
                        <Button
                          size="small"
                          variant="outlined"
                          color="neutral"
                          sx={{
                            fontWeight: "bold",
                            fontSize: 11,
                          }}
                          onClick={() => deleteAdRoom(ad.oid)}
                        >
                          Obriši
                        </Button>
                      </ThemeProvider>
                    </div>
                  ) : (
                    <></>
                  )}
                  {ad.tutorStudije ? (
                    <div className="dugmad">
                      <ThemeProvider theme={theme}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="neutral"
                          sx={{
                            fontWeight: "bold",
                            fontSize: 11,
                          }}
                          onClick={() => {
                            setIdT(ad.oid);
                            fillAdsT(ad.oid);
                            handleOpenT();
                          }}
                          type="submit"
                        >
                          Izmeni
                        </Button>

                        <br />
                        <br />
                        <Button
                          size="small"
                          variant="outlined"
                          color="neutral"
                          sx={{
                            fontWeight: "bold",
                            fontSize: 11,
                          }}
                          onClick={() => deleteAdRoom(ad.oid)}
                        >
                          Obriši
                        </Button>
                      </ThemeProvider>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
          </div>

          <div className="modal-izmena">
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={open}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={open}>
                <Box sx={style}>
                  <form
                    onSubmit={(e) => {
                      changeAd(e);
                    }}
                  >
                    <ThemeProvider theme={theme}>
                      <br />

                      <TextField
                        id="gradUpdate"
                        fullWidth
                        label="Unesite grad"
                        variant="standard"
                        size="small"
                        defaultValue={objava.city}
                      />
                      <br />
                      <FormControlLabel
                        control={
                          <Checkbox
                            id="stanUpdate"
                            size="small"
                            color="default"
                            defaultChecked={objava.apr}
                          />
                        }
                        label="Imam stan"
                      />
                      <br />
                      <TextField
                        id="brcUpdate"
                        label="Unesite koliko cimera tražite"
                        type="number"
                        defaultValue={objava.cimm}
                        fullWidth
                        InputProps={{
                          inputProps: { min: 0, max: 10 },
                        }}
                        variant="standard"
                      />
                      <br />

                      <br />
                      <TextField
                        multiline
                        id="opUpdate"
                        label="Unesite opis oglasa"
                        size="small"
                        fullWidth
                        variant="outlined"
                        minRows={5}
                        defaultValue={objava.desc}
                      />
                      <br />
                      <br />
                      <Button
                        id="bobjavi"
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
                        value={ads.oid}
                      >
                        Objavi
                      </Button>
                      <Button
                        id="izadji"
                        size="small"
                        variant="outlined"
                        color="neutral"
                        fullWidth
                        sx={{
                          fontWeight: "bold",
                          letterSpacing: 1,
                          fontSize: 15,
                        }}
                        onClick={handleClose}
                      >
                        Otkazi
                      </Button>
                    </ThemeProvider>
                  </form>
                </Box>
              </Fade>
            </Modal>
          </div>
          <div className="modal-izmena-study">
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={openSB}
              onClose={handleCloseSB}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openSB}>
                <Box sx={style}>
                  <form
                    onSubmit={(e) => {
                      changeAdStuddy(e);
                    }}
                  >
                    <ThemeProvider theme={theme}>
                      <br />
                      <FormLabel id="sbstudies-row-radio-buttons-group-label">
                        Tip studija
                      </FormLabel>
                      <RadioGroup
                        defaultValue={0}
                        value={objava.tipBuddy}
                        id="buddyStudijeUpdate"
                        row
                        aria-labelledby="sbstudies-row-radio-buttons-group-label"
                        name="studies-sbrow-radio-buttons-group"
                      >
                        <FormControlLabel
                          control={
                            <Radio
                              checked={objava.tipBuddy === 0}
                              value={0}
                              id="rbachelors"
                              sx={{
                                color: grey[800],
                                "&.Mui-checked": {
                                  color: grey[600],
                                },
                              }}
                            />
                          }
                          label="Osnovne"
                        />
                        <FormControlLabel
                          control={
                            <Radio
                              value={1}
                              checked={objava.tipBuddy === 1}
                              id="rbmasters"
                              sx={{
                                color: grey[800],
                                "&.Mui-checked": {
                                  color: grey[600],
                                },
                              }}
                            />
                          }
                          label="Master"
                        />
                        <FormControlLabel
                          control={
                            <Radio
                              value={2}
                              checked={objava.tipBuddy === 2}
                              id="rbphds"
                              sx={{
                                color: grey[800],
                                "&.Mui-checked": {
                                  color: grey[600],
                                },
                              }}
                            />
                          }
                          label="Doktorske"
                        />
                      </RadioGroup>
                      <InputLabel id="addadsb">Izaberite fakultet</InputLabel>
                      <Select
                        labelId="addadsb"
                        id="fadpredmetsb"
                        variant="standard"
                        label="Izaberite predmet"
                        fullWidth
                        value={fakultetid}
                        onChange={postaviFakultet}
                      >
                        {Array.isArray(fakulteti) && fakulteti.length ? (
                          fakulteti.map((p) => {
                            return (
                              <MenuItem key={p.fakultetId} value={p.fakultetId}>
                                {p.fakultetNaziv}
                              </MenuItem>
                            );
                          })
                        ) : (
                          <></>
                        )}
                      </Select>
                      <InputLabel id="addadsb">Izaberite predmet</InputLabel>
                      <Select
                        labelId="addadsb"
                        id="fadpredmetsb"
                        variant="standard"
                        label="Izaberite predmet"
                        fullWidth
                        value={predid}
                        onChange={postaviPredmet}
                      >
                        {predmet.map((p) => {
                          return (
                            <MenuItem key={p.id} value={p.id}>
                              {p.naziv}
                            </MenuItem>
                          );
                        })}
                      </Select>

                      <TextField
                        id="godinaStudijaSBUpdate"
                        label="Godina studija"
                        type="number"
                        defaultValue={objava.godStBuddy}
                        value={objava.godStBuddy}
                        fullWidth
                        InputProps={{
                          inputProps: { min: 1, max: 5 },
                        }}
                        variant="standard"
                      />
                      <br />
                      <br />
                      <TextField
                        multiline
                        id="opisUpdate"
                        label="Unesite opis oglasa"
                        size="small"
                        fullWidth
                        defaultValue={objava.desc}
                        variant="outlined"
                        minRows={5}
                      />
                      <br />
                      <br />
                      <Button
                        id="bobjavi"
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
                        value={ads.oid}
                        onClick={handleCloseSB}
                      >
                        Objavi
                      </Button>
                    </ThemeProvider>
                  </form>
                </Box>
              </Fade>
            </Modal>
          </div>
          <div className="modal-izmena-tutor">
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={openT}
              onClose={handleCloseT}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openT}>
                <Box sx={style}>
                  <form
                    onSubmit={(e) => {
                      changeAdT(e);
                    }}
                  >
                    <ThemeProvider theme={theme}>
                      <br />
                      <FormLabel id="sbstudies-row-radio-buttons-group-label">
                        Tip studija tutora
                      </FormLabel>
                      <RadioGroup
                        defaultValue={objava.tipTut}
                        value={objava.tipBuddy}
                        id="tutorStudijeUpdate"
                        row
                        aria-labelledby="sbstudies-row-radio-buttons-group-label"
                        name="studies-sbrow-radio-buttons-group"
                      >
                        <FormControlLabel
                          control={
                            <Radio
                              value="Osnovne"
                              id="rbachelors"
                              sx={{
                                color: grey[800],
                                "&.Mui-checked": {
                                  color: grey[600],
                                },
                              }}
                            />
                          }
                          label="Osnovne"
                        />
                        <FormControlLabel
                          control={
                            <Radio
                              value="Master"
                              id="rbmasters"
                              sx={{
                                color: grey[800],
                                "&.Mui-checked": {
                                  color: grey[600],
                                },
                              }}
                            />
                          }
                          label="Master"
                        />
                        <FormControlLabel
                          control={
                            <Radio
                              value="Doktorske"
                              id="rbphds"
                              sx={{
                                color: grey[800],
                                "&.Mui-checked": {
                                  color: grey[600],
                                },
                              }}
                            />
                          }
                          label="Doktorske"
                        />
                      </RadioGroup>
                      <InputLabel id="addadsb">Izaberite predmet</InputLabel>
                      <InputLabel id="addadsb">Izaberite fakultet</InputLabel>
                      <Select
                        labelId="addadsb"
                        id="fadpredmetsb"
                        variant="standard"
                        label="Izaberite predmet"
                        fullWidth
                        value={fakultetid}
                        onChange={postaviFakultet}
                      >
                        {Array.isArray(fakulteti) && fakulteti.length ? (
                          fakulteti.map((p) => {
                            return (
                              <MenuItem key={p.fakultetId} value={p.fakultetId}>
                                {p.fakultetNaziv}
                              </MenuItem>
                            );
                          })
                        ) : (
                          <></>
                        )}
                      </Select>
                      <InputLabel id="addadsb">Izaberite predmet</InputLabel>
                      <Select
                        labelId="addadsb"
                        id="fadpredmetsb"
                        variant="standard"
                        label="Izaberite predmet"
                        fullWidth
                        value={predid}
                        onChange={postaviPredmet}
                      >
                        {predmet.map((p) => {
                          return (
                            <MenuItem key={p.id} value={p.id}>
                              {p.naziv}
                            </MenuItem>
                          );
                        })}
                      </Select>

                      <TextField
                        id="godinaStudijaTUpdate"
                        label="Godina studija"
                        defaultValue={objava.godStudije}
                        type="number"
                        fullWidth
                        InputProps={{
                          inputProps: { min: 1, max: 5 },
                        }}
                        variant="standard"
                      />
                      <br />
                      <br />
                      <TextField
                        multiline
                        id="opisUpdate"
                        defaultValue={objava.desc}
                        label="Unesite opis oglasa"
                        size="small"
                        fullWidth
                        variant="outlined"
                        minRows={5}
                      />
                      <br />
                      <br />
                      <Button
                        id="bobjavi"
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
                        value={ads.oid}
                        onClick={handleCloseT}
                      >
                        Objavi
                      </Button>
                    </ThemeProvider>
                  </form>
                </Box>
              </Fade>
            </Modal>
          </div>
        </section>
      ) : (
        window.location = "/RegisterAndLoginPage"
      
      
      )}{" "}
    </>
  );
};
export default HomePage;
