import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import axios from "axios";
import "./Register&LoginPage.css";
import DefaultProfilePicture from "./components/img/defaultprofilepicture.jpg";
import { getRole, getUserId, getUsername } from "./services/utils";
import { Link, useNavigate } from "react-router-dom";
import "./components/TimeTable";
import Raspored from "./Raspored";
import TimeTable from "./components/TimeTable";
import WindowPics from "./components/WindowPics";
import {
  FormControl,
  ThemeProvider,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Backdrop,
  Fade,
  Input,
  IconButton,
  Box,
  Modal,
  Button,
  Select,
  MenuItem,
  getCardActionsUtilityClass,
  InputLabel,
  Alert,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { createTheme } from "@mui/material/styles";
import { uiUpdate } from "@syncfusion/ej2-react-schedule";
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
const styleObisi = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  borderRadius: "4px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const Profilepage = () => {
  var userId = getUserId();
  var userRole = getRole();
  var userUsername = getUsername();

  //--------------------------------------------
  const [clan, setClan] = useState({});
  const [path, setPath] = useState(`https://localhost:7048/Images/`);
  //--------------------------------------------
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openObrisi, setOpenObrisi] = useState(false);
  const handleOpenObrisi = () => setOpenObrisi(true);
  const handleCloseObrisi = () => setOpenObrisi(false);
  const r = getRole();
  //----------------------------------------------
  const [dataS, setShowDataS] = useState("show", "hide");
  const [dataP, setShowDataP] = useState("show", "hide");
  const showDataS = () => {
    setShowDataP("hide");
    setShowDataS("show");
  };
  const showDataP = () => {
    setShowDataS("hide");
    setShowDataP("show");
  };
  //----------------------------------------------
  const [fakultet, setFakultet] = useState([]);
  const fakulteti = () => {
    axios.get("https://localhost:7048/api/DataView/ListAllColl").then((res) => {
      setFakultet(res.data);
    });
  };
  //----------------------------------------------
  const [predid, setPredid] = useState("");
  const [pnaziv, setPnaziv] = useState("");
  const [faxnaziv, setFaxNaziv] = useState("");
  const [predmeti, setPredmeti] = useState([]);
  const [styleAlert, changeAlert] = useState("sakrij");
  const showAlert = () => {
    changeAlert("prikazi");
  };
  const postaviPredmet = (e) => {
    setPredid(e.target.value);
    setPnaziv(predmeti.find((p) => p.id === e.target.value));
  };
  const getPredmeti = () => {
    axios
      .get("https://localhost:7048/api/DataView/ReturnAllSubjects")
      .then((res) => {
        console.log(res.data);
        setPredmeti(res.data);
      });
  };
  //----------------------------------------------
  const [fax, setFax] = useState("");
  const [faxid, setFaxid] = useState("");
  const postaviFakultet = (e) => {
    setFaxid(e.target.value);
    setFax(fakultet.find((p) => p.fid === e.target.value));
  };
  // const [pr, setPredmet] = useState([]);
  // const predmeti = () => {
  //   axios
  //     .get("https://localhost:7048/api/DataView/ReturnAllSubjects")
  //     .then((res) => {
  //       console.log(res.data);
  //       setPredmet(res.data);
  //     });
  // };

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

  //-----------------------------------------------
  const token = localStorage.getItem("token");
  //-------------------UTISCI---------------------
  const [grades, setGrades] = useState([]);
  const [comms, setComms] = useState([]);
  //----------------------------------------------
  const [f, setF] = useState([]);
  const [prvi, setPrvi] = useState([]);
  const showFax = () => {
    axios
      .get(
        "https://localhost:7048/api/DataView/GetAllColByStudent/" + userUsername
      )
      .then((res) => {
        setF(res.data);
      });
  };
  const postaviPrvi = () => {
    axios
      .get(
        "https://localhost:7048/api/DataView/GetAllColByStudent/" + userUsername
      )
      .then((res) => {
        setPrvi(res.data[0].fakultetId);
      });
  };

  const [p, setPr] = useState([]);
  const showPred = () => {
    axios
      .get(
        "https://localhost:7048/api/DataView/ListAllSubjectsProf/" +
          userUsername
      )
      .then((res) => {
        setPr(res.data);
      });
  };

  const changeProfileData = (e) => {
    var nameUpdate = e.target.nameModal.value;
    var surnameUpdate = e.target.surenameModal.value;
    var emailUpdate = e.target.emailModal.value;
    // var pass = e.target.fmakepswd.value;
    var city = e.target.gardModal.value;
    var godst = e.target.godStModal.value;
    var rba = e.target.rbachelor;
    var rbm = e.target.rbmaster;
    //var nazivFakultekaUp = e.target.fakulteti;
    var t;
    if (rba.checked) {
      t = 0;
    } else if (rbm.checked) {
      t = 1;
    } else t = 2;

    // var dateUpdate = e.target.bdayModal.value;
    var opisUpdate = e.target.descModal.value;
    var genm = e.target.rbmale;
    var henNovi;
    if (genm.checked) {
      henNovi = 0;
    } else {
      henNovi = 1;
    }

    var usernameUpdate = e.target.usernameModal.value;
    var nastavnoUpdate = e.target.zvanjeModal.value;
    var obrUpdate = e.target.obrModal.value;

    const profUp = {
      cid: userId,
      ime: nameUpdate,
      prezime: surnameUpdate,
      polic: henNovi,
      username: usernameUpdate,
      opis: opisUpdate,
      nastavnoZvanje: nastavnoUpdate,
      obrazovanje: obrUpdate,
      predmetId: predid,
      //datumRodjenja: dateUpdate,
    };

    if (userRole == "Profesor") {
      axios
        .put(
          "https://localhost:7048/api/Professor/UpdateProf/",
          profUp,

          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setClan({
              name: nameUpdate,
              surname: surnameUpdate,
              gender: henNovi,
              profPredmet: predid,
              username: usernameUpdate,
              description: opisUpdate,
              nastavnoZ: nastavnoUpdate,
              obr: obrUpdate,
            });
            handleClose();
          } else {
            showAlert();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const stUp = {
        cid: userId,
        ime: nameUpdate,
        prezime: surnameUpdate,
        polic: henNovi,
        // email: emailUpdate,
        // datumRodjenja: dateUpdate,
        username: usernameUpdate,
        opis: opisUpdate,
        idfaksa: faxid,
        grad: city,
        godinaStudija: godst,
        tipStudija: t,
      };

      axios
        .put("https://localhost:7048/api/Student/UpdateStudent/", stUp, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setClan({
            name: nameUpdate,
            surname: surnameUpdate,
            gender: henNovi,
            email: emailUpdate,
            //birthdate: dateUpdate,
            username: usernameUpdate,
            description: opisUpdate,
            nazivFakulteka: faxid,
            city: city,
            godSt: godst,
            tip: t,
          });
          handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const profileData = () => {
    if (userRole == "Student") {
      axios
        .get("https://localhost:7048/api/DataView/DataView/" + userUsername, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res.data);
          console.log(userId);

          setPath(`https://localhost:7048/Images/`);
          setClan({
            name: res.data.ime,
            surname: res.data.prezime,
            gender: res.data.polic,
            email: res.data.email,
            birthdate: res.data.datumRodjenja,
            slika: res.data.slika,
            username: res.data.username,
            description: res.data.opis,
            //faculty: res.data.nazivFakulteka,
            city: res.data.grad,
            godSt: res.data.godinaStudija,
            tip: res.data.studija,
          });
          setPath((p) => (p += res.data.slika));
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (userRole == "Profesor") {
      axios
        .get("https://localhost:7048/api/DataView/DataView/" + userUsername, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setPath(`https://localhost:7048/Images/`);
          setClan({
            name: res.data.ime,
            surname: res.data.prezime,
            gender: res.data.polic,
            email: res.data.email,
            birthdate: res.data.datumRodjenja,
            slika: res.data.slika,
            ocenaProsek: res.data.ocenaProsek.toFixed(2),
            username: res.data.username,
            description: res.data.opis,
            nastavnoZ: res.data.nastavnoZvanje,
            obr: res.data.obrazovanje,
          });
          setPath((p) => (p += res.data.slika));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  var finalSt;
  if (clan.tip == 0) {
    finalSt = "Osnovne";
  } else if (clan.tip == 1) {
    finalSt = "Master";
  } else {
    finalSt = "Doktorske";
  }

  const showGrades = () => {
    axios
      .get(
        "https://localhost:7048/api/DataView/ListAllRatesForProf/" +
          userUsername
      )
      .then((res) => {
        setGrades(res.data);
      });
  };
  const showComms = () => {
    axios
      .get(
        "https://localhost:7048/api/DataView/ListAllCommentsForProf/" +
          userUsername
      )
      .then((res) => {
        setComms(res.data);
        console.log(res.data);
      });
  };
  useEffect(() => {
    profileData();
    fakulteti();
    if (userRole == "Student") {
      showDataS();
      showFax();
      postaviPrvi();
    } else {
      showDataP();
      showComms();
      showGrades();
      showPred();
    }
  }, []);
  const deleteProf = (e) => {
    e.preventDefault();
    var usr = e.target.usernameUnos.value;
    var passs = e.target.passUnos.value;
    var finalUser;
    if (userUsername === usr) {
      finalUser = usr;
    } else {
      console.log("ne valja username");
    }
    axios
      .delete(
        "https://localhost:7048/api/Authenticate/DeleteProfile/" +
          finalUser +
          "/" +
          passs,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res);
        window.localStorage.removeItem("token");
        console.log(token);
        window.location.reload();
        //  handleCloseObrisi();
        window.location("/RegisterAndLogin");
      });
  };
  //const [slika, setSlika] = useState("");
  const uploadImage = (e) => {
    const data = new FormData();
    data.append("slika", e.target.files[0]);
    console.log(e.target.files[0]);
    axios
      .post(
        "https://localhost:7048/api/Authenticate/UploadImage/" + userUsername,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setPath(`https://localhost:7048/Images/` + res.data);
        console.log("uspesno jeje");
        window.location.reload(false);
      })
      .catch((error) => {
        console.log(error);
        console.log("nece..");
      });
  };
  var birthday = new Date(clan.birthdate);
  var bday = `${birthday.getDate()}. ${
    birthday.getMonth() + 1
  }. ${birthday.getFullYear()}`;

  const t = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (t === null) navigate("/RegisterAndLoginPage", { replace: true });
  }, [t]);
  return (
    <section className="ProfilePage">
      <div id="boxProfile">
        <div id="barProfile">
          <span className="bartitle"></span>

          <WindowPics />
        </div>
        <div className="profilePicture">
          <div className="container">
            <div className="outer">
              {!clan.slika ? (
                <img src={DefaultProfilePicture} className="outer"></img>
              ) : (
                <img src={path} className="outer"></img>
              )}

              <div className="inner">
                <label htmlFor="icon-button-file">
                  <IconButton
                    color="default"
                    aria-label="upload picture"
                    component="span"
                  >
                    <PhotoCamera />
                    <Input
                      accept="image/*"
                      id="icon-button-file"
                      type="file"
                      onChange={uploadImage}
                    />
                  </IconButton>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="profile">
          <div className="osnovni">
            <div className="profile-row">
              <div className="profile-info">
                <div className="profile-title">Ime</div>
                <div className="profile-description" id="name">
                  {clan.name}
                </div>
              </div>
              <div className="profile-info">
                <div className="profile-title">Prezime</div>
                <div className="profile-description" id="surename">
                  {clan.surname}
                </div>
              </div>
            </div>
            <div className="profile-row">
              <div className="profile-info">
                <div className="profile-title">Pol</div>
                <div className="profile-description" id="gender">
                  {!clan.gender ? "Muški" : "Ženski"}
                </div>
              </div>
              <div className="profile-info">
                <div className="profile-title">Rođendan</div>
                <div className="profile-description" id="bday">
                  {bday}
                </div>
              </div>
            </div>
            <div className="profile-row">
              <div className="profile-info">
                <div className="profile-title">Korisničko ime</div>
                <div className="profile-description" id="username">
                  {clan.username}
                </div>
              </div>

              <div className="profile-info">
                <div className="profile-title">E-mail</div>
                <div className="profile-description" id="email">
                  {clan.email}
                </div>
              </div>
            </div>
            <div className="profile-row-desc">
              <div className="profile-title">Opis</div>
              <div className="profile-description" id="desc">
                {clan.description}
              </div>
            </div>
          </div>
          <div className={dataS}>
            <div className="profile-row">
              <div className="profile-info">
                <div className="profile-title">Naziv fakulteta</div>
                <div className="profile-description">
                  {Array.isArray(f) && f.length ? (
                    f.map((filip) => {
                      return (
                        <div key={filip.fakultetId}>{filip.fakultetNaziv}</div>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="profile-info">
                <div className="profile-title">Grad</div>
                <div className="profile-description" id="city">
                  {clan.city}
                </div>
              </div>
            </div>
            <div className="profile-row">
              <div className="profile-info">
                <div className="profile-title">Godina studija</div>
                <div className="profile-description" id="godSt">
                  {clan.godSt}
                </div>
              </div>
              <div className="profile-info">
                <div className="profile-title">Tip studija</div>
                <div className="profile-description" id="tipS">
                  {finalSt}
                </div>
              </div>
            </div>
          </div>

          <div className={dataP}>
            <div className="profile-row">
              <div className="profile-info">
                <div className="profile-title">Nastavno zvanje</div>
                <div className="profile-description" id="nastavnoZ">
                  {clan.nastavnoZ}
                </div>
              </div>
              <div className="profile-info">
                <div className="profile-title">Obrazovanje</div>
                <div className="profile-description" id="obr">
                  {clan.obr}
                </div>
              </div>
            </div>
            <div className="profile-row-desc">
              <div className="profile-title">Predmeti</div>
              <div className="profile-description" id="predmet">
                {p !== [] ? (
                  p.predmetId !== null ? (
                    p.map((jovan) => {
                      return (
                        <div key={jovan.predmetId}>
                          {jovan.predmetNaziv}, {jovan.fakultetNaziv}
                        </div>
                      );
                    })
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="profile-row-desc">
              <div className="profile-title">Prosečna ocena predavača</div>
              <div className="profile-description" id="predmet">
                {clan.ocenaProsek}
              </div>
            </div>
          </div>
        </div>
        <div id="centriraj" className="dugmiciProfila">
          <ThemeProvider theme={theme}>
            <Button
              id="ChangeAccount"
              size="small"
              variant="outlined"
              color="neutral"
              sx={{
                fontWeight: "bold",
                letterSpacing: 1,
                fontSize: 15,
                marginRight: "1rem",
              }}
              onClick={handleOpen}
            >
              Izmeni nalog
            </Button>
            <Button
              id="DeleteAccount"
              size="small"
              variant="outlined"
              color="neutral"
              sx={{
                fontWeight: "bold",
                letterSpacing: 1,
                fontSize: 15,
                marginRight: "1rem",
              }}
              onClick={handleOpenObrisi}
            >
              Obriši nalog
            </Button>
            {userRole === "Profesor" ? (
              <Button
                id="bPrikaziRaspored"
                size="small"
                variant="outlined"
                color="neutral"
                sx={{
                  fontWeight: "bold",
                  letterSpacing: 1,
                  fontSize: 15,
                }}
                onClick={() => (window.location = "/Raspored")}
              >
                Prikazi raspored
              </Button>
            ) : (
              <></>
            )}
          </ThemeProvider>
        </div>
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
                  changeProfileData(e);
                  window.location.reload(false);
                }}
              >
                <div className="profileModal">
                  <div className="profile-row">
                    <div className="profile-title">Ime</div>
                    <div className="profile-description" id="nameModal">
                      <ThemeProvider theme={theme}>
                        <TextField
                          id="nameModal"
                          defaultValue={clan.name}
                          variant="standard"
                          size="small"
                          fullWidth
                        />
                      </ThemeProvider>
                    </div>
                    <div className="profile-title">Prezime</div>
                    <div className="profile-description" id="surenameModal">
                      <ThemeProvider theme={theme}>
                        <TextField
                          id="surenameModal"
                          defaultValue={clan.surname}
                          variant="standard"
                          size="small"
                          fullWidth
                        />
                      </ThemeProvider>
                    </div>
                  </div>
                  <div className="profile-row">
                    <div className="profile-title">Pol</div>
                    <div className="profile-description" id="genderModal">
                      <ThemeProvider theme={theme}>
                        <RadioGroup
                          defaultValue={!clan.gender ? "muski" : "zenski"}
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                        >
                          <FormControlLabel
                            control={
                              <Radio
                                id="rbfemale"
                                value="zenski"
                                sx={{
                                  color: grey[800],
                                  "&.Mui-checked": {
                                    color: grey[600],
                                  },
                                }}
                              />
                            }
                            label="Ženski"
                          />
                          <FormControlLabel
                            control={
                              <Radio
                                id="rbmale"
                                value="muski"
                                sx={{
                                  color: grey[800],
                                  "&.Mui-checked": {
                                    color: grey[600],
                                  },
                                }}
                              />
                            }
                            label="Muški"
                          />
                        </RadioGroup>
                      </ThemeProvider>
                    </div>
                  </div>
                  <div className="profile-row">
                    <div className="profile-title">Username</div>
                    <div className="profile-description" id="usernameModal">
                      <ThemeProvider theme={theme}>
                        <TextField
                          id="usernameModal"
                          defaultValue={clan.username}
                          variant="standard"
                          size="small"
                          fullWidth
                        />
                      </ThemeProvider>
                    </div>
                    <div className="profile-title">E-mail</div>
                    <div className="profile-description" id="emailModal">
                      <ThemeProvider theme={theme}>
                        <TextField
                          id="emailModal"
                          defaultValue={clan.email}
                          variant="standard"
                          size="small"
                          fullWidth
                          disabled
                        />
                      </ThemeProvider>
                    </div>
                  </div>
                  <div className="profile-row-desc">
                    <div className="profile-title">Opis</div>
                    <div className="profile-description" id="descModal">
                      <ThemeProvider theme={theme}>
                        <TextField
                          id="descModal"
                          defaultValue={clan.description}
                          variant="outlined"
                          size="small"
                          multiline
                          fullWidth
                        />
                      </ThemeProvider>
                    </div>
                  </div>
                  <div className={dataS}>
                    <div className="profile-row">
                      <div className="profile-info">
                        <div className="profile-title">Naziv fakulteta</div>
                        <div id="faxModal">
                          <FormControl id="formctrl">
                            <ThemeProvider theme={theme}>
                              <Select
                                id="fakulteti"
                                variant="standard"
                                label="Izaberite fakultet"
                                value={faxid}
                                defaultValue={prvi}
                                onChange={postaviFakultet}
                                fullWidth
                              >
                                {fakultet.map((p) => {
                                  return (
                                    <MenuItem key={p.fid} value={p.fid}>
                                      {p.naziv}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </ThemeProvider>
                          </FormControl>
                        </div>
                      </div>

                      <div className="profile-info">
                        <div className="profile-title">Grad</div>
                        <div className="profile-description" id="gardModal">
                          <ThemeProvider theme={theme}>
                            <TextField
                              id="gardModal"
                              defaultValue={clan.city}
                              variant="standard"
                              size="small"
                              fullWidth
                            />
                          </ThemeProvider>
                        </div>
                      </div>
                    </div>

                    <div className="profile-row">
                      <div className="profile-info">
                        <div className="profile-title">Godina studija</div>
                        <div className="profile-description" id="godStModal">
                          <ThemeProvider theme={theme}>
                            <TextField
                              id="godStModal"
                              defaultValue={clan.godSt}
                              variant="standard"
                              size="small"
                              fullWidth
                              type="number"
                            />
                          </ThemeProvider>
                        </div>
                      </div>
                      <div className="profile-info">
                        <div className="profile-title">Tip studija</div>
                        <div className="profile-description">
                          <ThemeProvider theme={theme}>
                            <RadioGroup
                              defaultValue="Osnovne"
                              row
                              aria-labelledby="studies-row-radio-buttons-group-label"
                              name="studies-row-radio-buttons-group"
                            >
                              <FormControlLabel
                                control={
                                  <Radio
                                    value="Osnovne"
                                    id="rbachelor"
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
                                    id="rbmaster"
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
                                    id="rbphd"
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
                          </ThemeProvider>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={dataP}>
                  <div className="profile-row">
                    <div className="profile-info">
                      <div className="profile-title">Nastavno zvanje</div>
                      <div className="profile-description" id="zvanjeModal">
                        <ThemeProvider theme={theme}>
                          <TextField
                            id="zvanjeModal"
                            defaultValue={clan.nastavnoZ}
                            variant="standard"
                            size="small"
                            fullWidth
                          />
                        </ThemeProvider>
                      </div>
                    </div>
                    <div className="profile-info">
                      <div className="profile-title">Obrazovanje</div>
                      <div className="profile-description" id="obrModal">
                        <ThemeProvider theme={theme}>
                          <TextField
                            id="obrModal"
                            defaultValue={clan.obr}
                            variant="standard"
                            size="small"
                            fullWidth
                          />
                        </ThemeProvider>
                      </div>
                    </div>
                  </div>
                  <div className="profile-row">
                    <div className="profile-info">
                      <div className="profile-title">Predmet</div>
                      <div className="profile-description" id="predModal">
                        <ThemeProvider theme={theme}>
                          <InputLabel id="faxprof">
                            Izaberite fakultet
                          </InputLabel>
                          <Select
                            id="faxprof"
                            variant="standard"
                            label="Izaberite fakultet"
                            value={faxid}
                            onChange={(e) => {
                              postaviFakultet(e);
                              showCertCoures(e);
                            }}
                            fullWidth
                          >
                            {fakultet.map((p) => {
                              return (
                                <MenuItem key={p.fid} value={p.fid}>
                                  {p.naziv}
                                </MenuItem>
                              );
                            })}
                          </Select>

                          <InputLabel id="filtersb">
                            Izaberite predmet
                          </InputLabel>
                          <Select
                            labelId="filtersb"
                            id="predmeti"
                            variant="standard"
                            label="Izaberite predmet"
                            fullWidth
                            value={predid}
                            onChange={postaviPredmet}
                          >
                            {predmeti.map((p) => {
                              return (
                                <MenuItem key={p.pid} value={p.pid}>
                                  {p.naziv}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </ThemeProvider>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="srediDugmice">
                  <ThemeProvider theme={theme}>
                    <Button
                      id="SaveChanges"
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
                      Sačuvaj izmene
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="neutral"
                      sx={{
                        fontWeight: "bold",
                        letterSpacing: 1,
                        fontSize: 15,
                      }}
                      onClick={handleClose}
                    >
                      Izađi
                    </Button>
                    <div className={styleAlert} id="nemaOglas">
                      <Alert severity="error">Vec ste uneli taj predmet!</Alert>
                    </div>
                  </ThemeProvider>
                </div>
              </form>
            </Box>
          </Fade>
        </Modal>

        <div className={dataP} id="centriraj"></div>

        <div id="ocene" className="recenzija">
          {Array.isArray(grades) && grades.length ? (
            grades.map((grade) => {
              return (
                <div className="cardG" key={grade.ocenaId}>
                  <div className="card-headerG">{grade.student}</div>
                  <div className="card-bodyG">
                    <div className="card-titleG">
                      <p>Ocena: {grade.ocena}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
        <div id="komentari" className="recenzija">
          {Array.isArray(comms) && comms.length ? (
            comms.map((comm) => {
              var datumKom = new Date(comm.datumPostavljanja).toLocaleString();
              // const velikiKom = `${datumKom.getDate()}/${datumKom.getMonth()}/${datumKom.getFullYear()}  ${datumKom.getHours()}:${datumKom.getMinutes()}`;
              return (
                <div className="card" key={comm.komentarId}>
                  <div className="card-header">
                    <p>
                      {comm.student}, {datumKom}
                    </p>
                  </div>
                  <div className="card-body">
                    <div className="card-title">
                      <p>{comm.tekst}</p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="modal-dodaj-raspored">
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openObrisi}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openObrisi}>
            <Box sx={styleObisi}>
              <ThemeProvider theme={theme}>
                <form onSubmit={(e) => deleteProf(e)}>
                  <FormLabel id="dodaj-raspored">
                    Ocete da se obrisete?
                  </FormLabel>

                  <TextField
                    id="usernameUnos"
                    fullWidth
                    label="Unesite username:"
                    variant="standard"
                    size="small"
                  />

                  <TextField
                    id="passUnos"
                    label="Unesite password:"
                    type="password"
                    variant="standard"
                    size="small"
                    fullWidth
                  />

                  <Button
                    id="delete"
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
                    OBRISI ME
                  </Button>
                </form>
              </ThemeProvider>
            </Box>
          </Fade>
        </Modal>
      </div>
    </section>
  );
};

export default Profilepage;
