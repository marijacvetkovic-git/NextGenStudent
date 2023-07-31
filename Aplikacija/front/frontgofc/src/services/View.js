import React, { useState, useEffect } from "react";
import axios from "axios";
import { getRole, getUserId, getUsername } from "../services/utils";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DefaultProfilePicture from "../components/img/defaultprofilepicture.jpg";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
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
import "../ProfilePage.css";
import { Link } from "react-router-dom";

const ro = getRole();
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

const styleRecenzija = {
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

const View = () => {
  const [idg, setIdGrade] = useState(null);
  const [idcom, setIdComm] = useState(null);
  const [openComm, setOpenComm] = useState(false);
  const handleOpenComm = () => setOpenComm(true);
  const handleCloseComm = () => setOpenComm(false);

  const [openGrade, setOpenGrade] = useState(false);
  const handleOpenGrade = () => setOpenGrade(true);
  const handleCloseGrade = () => setOpenGrade(false);
  const [openGradeUp, setOpenGradeUp] = useState(false);
  const handleOpenGradeUp = () => setOpenGradeUp(true);
  const handleCloseGradeUp = () => setOpenGradeUp(false);
  const [openCommUp, setOpenCommUp] = useState(false);
  const handleOpenCommUp = () => setOpenCommUp(true);
  const handleCloseCommUp = () => setOpenCommUp(false);
  const token = localStorage.getItem("token");
  const usernam = window.location.href.split("/")[4];
  const role = window.location.href.split("/")[5];

  const u = getUsername();
  //------------------------------------
  const [raspored, setRaspored] = useState([]);
  const [idc, setcasId] = useState(null);
  const [pr, setPredmet] = useState(null);
  const [predid, setPredid] = useState("");
  const [predmeti, setPredmeti] = useState([]);
  const [pnaziv, setPnaziv] = useState("");
  const postaviPredmet = (e) => {
    setPredid(e.target.value);
    setPnaziv(predmeti.find((p) => p.id == e.target.value));
  };

  const getRaspored = () => {
    axios
      .get("https://localhost:7048/api/DataView/ReturnSchedule/" + usernam)
      .then((res) => {
        setRaspored(res.data);
      });
  };
  const getPredmetiProf = () => {
    axios
      .get("https://localhost:7048/api/DataView/ListAllSubjectsProf/" + usernam)
      .then((res) => {
        setPredmeti(res.data);
      });
  };
  var curr = new Date();
  var first = curr.getDate() - curr.getDay() + 1;
  var last = first + 6;

  var firstday = new Date(curr.setDate(first)).toLocaleDateString();
  var lastday = new Date(curr.setDate(last)).toLocaleDateString();

  //-------------------------------------
  const [student, setStudent] = useState({});

  const [path, setPath] = useState(`https://localhost:7048/Images/`);
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
  const [f, setF] = useState([]);
  const showFax = () => {
    axios
      .get("https://localhost:7048/api/DataView/GetAllColByStudent/" + usernam)
      .then((res) => {
        setF(res.data);
      });
  };
  const [p, setPr] = useState([]);
  const showPred = () => {
    axios
      .get("https://localhost:7048/api/DataView/ListAllSubjectsProf/" + usernam)
      .then((res) => {
        setPr(res.data);
      });
  };
  const [styleAlert, changeAlert] = useState("sakrij");

  const showAlert = () => {
    changeAlert("prikazi");
  };
  const hideAlert = () => {
    changeAlert("sakrij");
  };
  const profileData = async () => {
    if (role == 0) {
      await axios
        .get("https://localhost:7048/api/DataView/DataView/" + usernam)
        .then((res) => {
          setPath(`https://localhost:7048/Images/`);
          setStudent({
            name: res.data.ime,
            surname: res.data.prezime,
            gender: res.data.polic,
            email: res.data.email,
            birthdate: res.data.datumRodjenja,
            slika: res.data.slika,
            username: res.data.username,
            description: res.data.opis,
            nazivFakulteka: res.data.nazivFakulteka,
            city: res.data.grad,
            godSt: res.data.godinaStudija,
            tip: res.data.studija,
          });
          setPath((p) => (p += res.data.slika));
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (role == 1) {
      await axios
        .get("https://localhost:7048/api/DataView/DataView/" + usernam)
        .then((res) => {
          if (res.status == 200) {
            setPath(`https://localhost:7048/Images/`);
            setStudent({
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
            getRaspored();
          } else {
            showAlert();
          }

          showPred();
          getPredmetiProf();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const upisimenacas = (idcas) => {
    const st = getUserId();
    const usrp = student.username;

    const frb = {
      casId: idcas,
      clanId: st,
      usernameProf: usrp,
      predmetId: predid,
    };
    axios
      .put("https://localhost:7048/api/Student/AddStudentsToSchadule/", frb, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRaspored(
          res.data.map((ad) => {
            return {
              student: ad.student,
            };
          })
        );
      });
  };
  const otkaziCas = (idcas) => {
    const st = getUserId();
    const ot = {
      casId: idcas,
      clanId: st,
    };

    axios
      .put("https://localhost:7048/api/Student/CancelClass", ot, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {});
  };
  var finalSt;
  if (student.tip == 0) {
    finalSt = "Osnovne";
  } else if (student.tip == 1) {
    finalSt = "Master";
  } else {
    finalSt = "Doktorske";
  }
  useEffect(() => {
    profileData();
    if (role == 0) {
      showDataS();
      showFax();
    } else {
      showDataP();
    }
  }, []);
  var birthday = new Date(student.birthdate);
  var bday = `${birthday.getDate()}. ${
    birthday.getMonth() + 1
  }. ${birthday.getFullYear()}`;
  const usrProf = student.username;
  const stid = getUserId();

  const [grades, setGrades] = useState([]);
  const [comms, setComms] = useState([]);
  const showGrades = () => {
    axios
      .get("https://localhost:7048/api/DataView/ListAllRatesForProf/" + usernam)
      .then((res) => {
        setGrades(res.data);
      });
  };
  const showComms = () => {
    axios
      .get(
        "https://localhost:7048/api/DataView/ListAllCommentsForProf/" + usernam
      )
      .then((res) => {
        setComms(res.data);
      });
  };
  useEffect(() => {
    if (role == "Student") {
    } else {
      showComms();
      showGrades();
    }
  }, []);
  const addGrade = (e) => {
    e.preventDefault();
    var ocena = e.target.nocena.value;

    const rate = {
      ocena: ocena,
      usernameProf: usrProf,
      idStud: stid,
    };
    axios
      .post("https://localhost:7048/api/Student/RateProf", rate, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
  };
  const addComm = (e) => {
    e.preventDefault();
    var komtekst = e.target.tekstComm.value;

    const comment = {
      studId: stid,
      usernameProf: usrProf,
      tekst: komtekst,
    };
    axios
      .post("https://localhost:7048/api/Student/AddComment", comment, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
  };
  const updateGrade = (e) => {
    e.preventDefault();
    var ocenaUpdate = e.target.nocenaUp.value;
    const rate = {
      idOcene: idg,
      ocena: ocenaUpdate,
      usernameProf: usrProf,
      idStud: stid,
    };
    axios
      .put("https://localhost:7048/api/Student/ChangeRate", rate, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const index = grades.findIndex((rate) => rate.idOcene === idg);
        const updatedGrades = [...grades];
        updatedGrades[index] = rate;
        setGrades(updatedGrades);
        handleCloseGradeUp();
        showGrades();
      });
  };
  const updateComm = (e) => {
    e.preventDefault();
    var komtekst = e.target.tekstCommUp.value;
    const comment = {
      komentarId: idcom,
      studId: stid,
      usernameProf: usrProf,
      tekst: komtekst,
    };
    axios
      .put("https://localhost:7048/api/Student/UpdateAComment", comment, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const index = comms.findIndex(
          (comment) => comment.komentarId === idcom
        );
        const updatedComms = [...comms];
        updatedComms[index] = comment;
        setComms(updatedComms);
        handleCloseCommUp();
        showComms();
      });
  };
  const deleteComm = (idComm) => {
    axios
      .delete("https://localhost:7048/api/Student/DeleteComment/" + idComm, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setComms((comms) => showComms((comm) => comm.idKom !== idComm));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <section className="ProfilePage">
        <div id="boxProfile">
          <div id="barProfile">
            <span className="bartitleBig"></span>

            <WindowPics />
          </div>
          <div className="profilePicture">
            <div className="container">
              <div className="outer">
                {!student.slika ? (
                  <img src={DefaultProfilePicture} className="outer"></img>
                ) : (
                  <img src={path} className="outer"></img>
                )}
              </div>
            </div>
            {/* <ThemeProvider theme={theme}>
              <Button
                id="bPrijavi"
                size="small"
                variant="text"
                color="neutral"
                sx={{
                  fontWeight: "bold",
                  letterSpacing: 1,
                  fontSize: 10,
                }}
                // onClick={handleOpenReport()}
              >
                Prijavi korisnika
              </Button>
              {/* <div className={styleAlertReport} id="uspesnaPrijava">
                <Alert severity="info">
                  Vaša prijava je poslata na razmatranje!
                </Alert>
              </div>  
            </ThemeProvider> */}
            {token === null ? (
              <></>
            ) : (
              <Link to={`/BannedPage/${usernam}`}>PRIJAVITE KORISNIKA</Link>
            )}
          </div>

          <div className="profile">
            <div className="osnovni">
              <div className="profile-row">
                <div className="profile-info">
                  <div className="profile-title">Ime</div>
                  <div className="profile-description" id="name">
                    {student.name}
                  </div>
                </div>
                <div className="profile-info">
                  <div className="profile-title">Prezime</div>
                  <div className="profile-description" id="surename">
                    {student.surname}
                  </div>
                </div>
              </div>
              <div className="profile-row">
                <div className="profile-info">
                  <div className="profile-title">Pol</div>
                  <div className="profile-description" id="gender">
                    {/* {student.gender} */}
                    {!student.gender ? "Muski" : "Zenski"}
                  </div>
                </div>
                <div className="profile-info">
                  <div className="profile-title">Rodjendan</div>
                  <div className="profile-description" id="bday">
                    {bday}
                  </div>
                </div>
              </div>
              <div className="profile-row">
                <div className="profile-info">
                  <div className="profile-title">Username</div>
                  <div className="profile-description" id="username">
                    {student.username}
                  </div>
                </div>

                <div className="profile-info">
                  <div className="profile-title">E-mail</div>
                  <div className="profile-description" id="email">
                    {student.email}
                  </div>
                </div>
              </div>
              <div className="profile-row-desc">
                <div className="profile-title">Opis</div>
                <div className="profile-description" id="desc">
                  {student.description}
                </div>
              </div>
            </div>

            <div className={dataS}>
              <div className="profile-row">
                <div className="profile-info">
                  <div className="profile-title">Naziv fakulteta</div>
                  <div className="profile-description" id="faculty">
                    {Array.isArray(f) && f.length ? (
                      f.map((filip) => {
                        return (
                          <div key={filip.fakultetId}>
                            {filip.fakultetNaziv}
                          </div>
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
                    {student.city}
                  </div>
                </div>
              </div>
              <div className="profile-row">
                <div className="profile-info">
                  <div className="profile-title">Godina studija</div>
                  <div className="profile-description" id="godSt">
                    {student.godSt}
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
                    {student.nastavnoZ}
                  </div>
                </div>
                <div className="profile-info">
                  <div className="profile-title">Obrazovanje</div>
                  <div className="profile-description" id="obr">
                    {student.obr}
                  </div>
                </div>
              </div>
              <div className="profile-row-desc">
                <div className="profile-title">Predmet</div>
                <div className="profile-description" id="predmet">
                  {Array.isArray(p) && p.length ? (
                    p.map((jovan) => {
                      return (
                        <div key={jovan.predmetId}>
                          {jovan.predmetNaziv}, {jovan.fakultetNaziv}
                        </div>
                      );
                    })
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="profile-row-desc">
                <div className="profile-title">Prosečna ocena predavača</div>
                <div className="profile-description" id="predmet">
                  {student.ocenaProsek}
                </div>
              </div>
            </div>
          </div>

          <div className={dataP}>
            <section className="tiemtavle">
              <ThemeProvider theme={theme}>
                <FormLabel>
                  Tekuća nedelja traje od {firstday} do {lastday}
                </FormLabel>
                <br />
                <b />
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 300 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Predmet</TableCell>
                        <TableCell>Datum</TableCell>
                        <TableCell>Vreme od</TableCell>
                        <TableCell>Vreme do</TableCell>
                        <TableCell>Cena</TableCell>
                        <TableCell>Student</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(raspored) && raspored.length ? (
                        raspored.map((r) => {
                          return (
                            <TableRow
                              key={r.id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              {r.predmet == null ? (
                                <TableCell>
                                  <InputLabel id="filtersb">
                                    Izaberite predmet
                                  </InputLabel>
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
                                        <MenuItem
                                          key={p.predmetId}
                                          value={p.predmetId}
                                        >
                                          {p.predmetNaziv}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                </TableCell>
                              ) : (
                                <TableCell>{r.predmet}</TableCell>
                              )}
                              <TableCell>{r.pocetakDatum}</TableCell>
                              <TableCell>{r.pocetakVreme}</TableCell>
                              <TableCell>{r.zavrsetakVreme}</TableCell>
                              <TableCell>{r.cena}</TableCell>
                              <TableCell>
                                {token == null ? (
                                  <>
                                    <p>
                                      <a href="/RegisterAndLoginPage">
                                        Morate biti prijavljeni
                                      </a>
                                    </p>
                                  </>
                                ) : r.student !== u ? (
                                  r.zakazan ? (
                                    <>{r.student} </>
                                  ) : (
                                    <ThemeProvider theme={theme}>
                                      <Button
                                        id="bUpisiSe"
                                        size="small"
                                        variant="outlined"
                                        color="neutral"
                                        sx={{
                                          fontWeight: "bold",
                                          letterSpacing: 1,
                                          fontSize: 15,
                                        }}
                                        onClick={(e) => {
                                          setcasId(r.id);
                                          setPredmet(r.predmetId);
                                          upisimenacas(r.id);
                                          window.location.reload(false);
                                        }}
                                      >
                                        Upiši se na čas
                                      </Button>
                                    </ThemeProvider>
                                  )
                                ) : r.zakazan ? (
                                  <>
                                    {r.student}
                                    <ThemeProvider theme={theme}>
                                      <Button
                                        id="bUpisiSe"
                                        size="small"
                                        variant="outlined"
                                        color="neutral"
                                        sx={{
                                          fontWeight: "bold",
                                          letterSpacing: 1,
                                          fontSize: 15,
                                        }}
                                        onClick={(e) => {
                                          otkaziCas(r.id);
                                          window.location.reload(false);
                                        }}
                                      >
                                        Otkaži čas
                                      </Button>
                                    </ThemeProvider>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ThemeProvider>
            </section>
            <div className={styleAlert} id="nemaOglas">
              <Alert severity="error">Trenutno nema slobodnih termina!</Alert>
            </div>
            <br />
            <br />
            {token === null ? (
              <></>
            ) : (
              <div id="centriraj">
                <ThemeProvider theme={theme}>
                  <Button
                    id="addGrade"
                    size="small"
                    variant="outlined"
                    color="neutral"
                    sx={{
                      fontWeight: "bold",
                      letterSpacing: 1,
                      fontSize: 15,
                      marginRight: "1rem",
                    }}
                    onClick={handleOpenGrade}
                  >
                    Dodajte ocenu
                  </Button>

                  <Button
                    id="baddComm"
                    size="small"
                    variant="outlined"
                    color="neutral"
                    sx={{
                      fontWeight: "bold",
                      letterSpacing: 1,
                      fontSize: 15,
                      marginRight: "1rem",
                    }}
                    onClick={handleOpenComm}
                  >
                    Dodaj komentar
                  </Button>
                </ThemeProvider>
              </div>
            )}

            <div id="review">
              <div id="ocene" className="recenzije">
                {Array.isArray(grades) && grades.length ? (
                  grades.map((grade) => {
                    return (
                      <div className="cardG" key={grade.ocenaId}>
                        <div className="card-headerG">{grade.student}</div>
                        <div className="card-bodyG">
                          <div className="card-titleG">
                            <p>Ocena: {grade.ocena}</p>
                            {u === grade.student ? (
                              <IconButton
                                aria-label="update"
                                size="small"
                                onClick={() => {
                                  setIdGrade(grade.ocenaId);
                                  handleOpenGradeUp();
                                }}
                              >
                                <SettingsIcon fontSize="inherit" />
                              </IconButton>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <></>
                )}
              </div>
              <div id="komentari" className="recenzije">
                {Array.isArray(comms) && comms.length ? (
                  comms.map((comm) => {
                    var datumKom = new Date(
                      comm.datumPostavljanja
                    ).toLocaleString();
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

                            {u === comm.student ? (
                              <>
                                <IconButton
                                  aria-label="update"
                                  size="small"
                                  onClick={() => {
                                    setIdComm(comm.komentarId);
                                    handleOpenCommUp();
                                  }}
                                >
                                  <SettingsIcon fontSize="inherit" />
                                </IconButton>
                                <IconButton
                                  aria-label="delete"
                                  size="small"
                                  onClick={() => {
                                    deleteComm(comm.komentarId);
                                  }}
                                >
                                  <DeleteIcon fontSize="inherit" />
                                </IconButton>
                              </>
                            ) : (
                              <></>
                            )}
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
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={openGradeUp}
              onClose={handleCloseGradeUp}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openGradeUp}>
                <Box sx={styleRecenzija}>
                  <ThemeProvider theme={theme}>
                    <form onSubmit={(e) => updateGrade(e)}>
                      <FormLabel id="izmeni-ocenu">
                        Promenite ocenu koju ste dali profesoru
                      </FormLabel>
                      <TextField
                        id="nocenaUp"
                        label="Ocena"
                        type="number"
                        fullWidth
                        InputProps={{
                          inputProps: { min: 1, max: 5 },
                        }}
                        variant="standard"
                      />
                      <br />
                      <br />
                      <br />
                      <br />
                      <Button
                        id="bUpGrade"
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
                        Izmeni ocenu
                      </Button>
                    </form>
                  </ThemeProvider>
                </Box>
              </Fade>
            </Modal>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={openGrade}
              onClose={handleCloseGrade}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openGrade}>
                <Box sx={styleRecenzija}>
                  <ThemeProvider theme={theme}>
                    <form onSubmit={(e) => addGrade(e)}>
                      <FormLabel id="dodaj-ocenu">
                        Dodajte ocenu profesoru
                      </FormLabel>
                      <TextField
                        id="nocena"
                        label="Ocena"
                        type="number"
                        fullWidth
                        InputProps={{
                          inputProps: { min: 1, max: 5 },
                        }}
                        variant="standard"
                      />
                      <br />
                      <br />
                      <br />
                      <br />
                      <Button
                        id="bAddGrade"
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
                        Sačuvaj
                      </Button>
                    </form>
                  </ThemeProvider>
                </Box>
              </Fade>
            </Modal>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={openCommUp}
              onClose={handleCloseCommUp}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openCommUp}>
                <Box sx={styleRecenzija}>
                  <ThemeProvider theme={theme}>
                    <form onSubmit={(e) => updateComm(e)}>
                      <FormLabel id="izmeni-komentar">
                        Izmenite komentar o radu profesora
                      </FormLabel>
                      <TextField
                        id="tekstCommUp"
                        fullWidth
                        label="Unesite komentar:"
                        variant="standard"
                        size="small"
                        multiline
                        minRows={5}
                      />
                      <br />
                      <br />
                      <Button
                        id="bAddCommUp"
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
                        Sačuvaj izmene
                      </Button>
                    </form>
                  </ThemeProvider>
                </Box>
              </Fade>
            </Modal>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              open={openComm}
              onClose={handleCloseComm}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={openComm}>
                <Box sx={styleRecenzija}>
                  <ThemeProvider theme={theme}>
                    <form onSubmit={(e) => addComm(e)}>
                      <FormLabel id="dodaj-komentar">
                        Dodajte komentar o radu profesora
                      </FormLabel>
                      <TextField
                        id="tekstComm"
                        fullWidth
                        label="Unesite komentar:"
                        variant="standard"
                        size="small"
                        multiline
                        minRows={5}
                      />
                      <br />
                      <br />
                      <Button
                        id="bAddComm"
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
                        Sačuvaj izmene
                      </Button>
                    </form>
                  </ThemeProvider>
                </Box>
              </Fade>
            </Modal>
          </div>
        </div>
      </section>
    </div>
  );
};

export default View;
