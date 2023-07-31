import React, { useState, useEffect } from "react";
import "./Register&LoginPage.css";
import "./HomePage.css";
import Login from "./LoginForm";
import Axios from "axios";
import WindowPics from "./components/WindowPics";
import axios from "axios";
import {
  FormControl,
  createTheme,
  ThemeProvider,
  TextField,
  RadioGroup,
  Radio,
  Button,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Alert,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { PersonAddDisabledOutlined } from "@mui/icons-material";
const RegisterAndLogin = () => {
  const [styleAlert, changeAlert] = useState("sakrij");

  const showAlert = () => {
    changeAlert("prikazi");
  };
  const [styleLogin, changeLogin] = useState("login1", "register2");
  const showLogin = () => {
    changeRegister("register1");
    changeLogin("login2");
  };

  const [styleRegister, changeRegister] = useState("register1", "login2");
  const showRegister = () => {
    changeRegister("register2");
    changeLogin("login1");
  };

  const [RegisterProfessor, changeProfessor] = useState(
    "register1",
    "register2"
  );
  const [registerEveryone, changeEveryone] = useState("register1", "register2");
  const showProfessor = () => {
    changeStudent("register1");
    changeProfessor("register2");
    changeEveryone("register2");
  };

  const [RegisterStudent, changeStudent] = useState("register1", "register2");
  const showStudent = () => {
    changeStudent("register2");
    changeProfessor("register1");
    changeEveryone("register2");
  };

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
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [description, setDescription] = useState("");
  const [faculty, setFaculty] = useState("");
  const [city, setCity] = useState("");
  const [nastavnoZvanje, setNastavnoZvanje] = useState("");
  const [obrazovanje, setObrazovanje] = useState("");
  ///----validacije
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [birthdateError, setBirthdateError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [facultyError, setFacultyError] = useState("");
  const [cityError, setCityError] = useState("");
  const [nastavnoZvanjeError, setNastavnoZvanjeError] = useState("");
  const [obrazovanjeError, setObrazovanjeError] = useState("");

  const emailValidation = (e) => {
    e.preventDefault();
    const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
    if (regEx.test(email)) {
      setEmailError("Valid Email");
    } else if (!regEx.test(email) && email !== "") {
      setEmailError(true);
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNameError(false);
    setSurnameError(false);
    setUsernameError(false);
    setEmailError(false);
    setPasswordError(false);
    setBirthdateError(false);
    setDescriptionError(false);
    setFacultyError(false);
    setCityError(false);
    setObrazovanjeError(false);
    setNastavnoZvanjeError(false);
    if (name == "") {
      setNameError(true);
    }
    if (surname == "") {
      setSurnameError(true);
    }
    if (username == "") {
      setUsernameError(true);
    }
    if (email == "") {
      setEmailError(true);
    }
    if (password == "") {
      setPasswordError(true);
    }
    if (birthdate == "") {
      setBirthdateError(true);
    }
    if (description == "") {
      setDescriptionError(true);
    }
    if (faculty == "") {
      setFacultyError(true);
    }
    if (city == "") {
      setCityError(true);
    }
    if (nastavnoZvanje == "") {
      setNastavnoZvanjeError(true);
    }
    if (obrazovanje == "") {
      setObrazovanjeError(true);
    }
  };
  /////--------------axios stvari
  const dataGet = (e) => {
    e.preventDefault();

    var name = e.target.fname.value;
    var surname = e.target.fsurname.value;
    var email = e.target.femail.value;
    var pass = e.target.fmakepswd.value;
    var genm = e.target.rbmale;
    //var genf = e.target.rbfemale;
    var date = e.target.fbirthdate.value;
    var opis = e.target.fopis.value;
    //var stud = e.target.togglestudent;
    var prof = e.target.toggleprofessor;
    var username = e.target.fusername.value;
    var grad = e.target.fcity.value;
    var ulogica;
    var finalgen;
    if (genm.checked) {
      finalgen = 0;
    } else {
      finalgen = 1;
    }

    if (prof.checked) {
      var nastavno = e.target.fnastavnozvanje.value;
      var obr = e.target.fobrazovanje.value;
      ulogica = 1;
      const i = {
        ime: name,
        prezime: surname,
        username: username,
        password: pass,
        email: email,
        polic: finalgen,
        datumRodjenja: date,
        opis: opis,
        nastavnoZvanje: nastavno,
        obrazovanje: obr,
      };
      console.log(i);
      Axios.post(
        "https://localhost:7048/api/Authenticate/register-professor/",
        i
      )
        .then((res) => {
          console.log("Getting from : ", res.i);
          showAlert();
        })
        .catch((err) => console.log(err.message));
      //  }
    } else {
      var godinas = e.target.fyear.value;
      var rba = e.target.rbachelor;
      var rbm = e.target.rbmaster;
      var rphd = e.target.rbphd;
      var m;

      if (rba.checked) {
        m = 0;
      } else if (rbm.checked) {
        m = 1;
      } else m = 2;

      ulogica = 0;

      const i = {
        ime: name,
        prezime: surname,
        username: username,
        password: pass,
        email: email,
        polic: finalgen,
        datumRodjenja: date,
        opis: opis,
        grad: grad,
        godinaStudija: godinas,
        studija: m,
        fakultetId: faxid,
      };
      console.log(faxid);
      Axios.post("https://localhost:7048/api/Authenticate/register-student/", i)
        .then((res) => {
          console.log("Getting from : ", res.i);
          console.log(res.data);
          showAlert();
        })
        .catch((err) => console.log(err.message));
    }
  };
  const [fax, setFax] = useState("");
  const [faxid, setFaxid] = useState("");
  const postaviFakultet = (e) => {
    setFaxid(e.target.value);
    setFax(fakultet.find((p) => p.fid === e.target.value));
  };
  const [fakultet, setFakultet] = useState([]);
  const fakulteti = () => {
    axios.get("https://localhost:7048/api/DataView/ListAllColl").then((res) => {
      setFakultet(res.data);
    });
  };
  useEffect(() => {
    fakulteti();
  }, []);
  return (
    <section className="RAndL">
      <div id="boxRAndL">
        <div id="barRAndL">
          <span className="bartitle">
            <span id="cregister" className={styleRegister}>
              Registracija
            </span>
            <span id="clogin" className={styleLogin}>
              Prijavljivanje
            </span>
          </span>
          <WindowPics />
        </div>
        <div id="obeForme">
          <div id="changeAccess">
            <ThemeProvider theme={theme}>
              <div id="pickAccess">
                <RadioGroup
                  row
                  aria-labelledby="access-demo-row-radio-buttons-group-label"
                  name="access-row-radio-buttons-group"
                >
                  <FormControlLabel
                    value="register"
                    id="rbRegister"
                    control={
                      <Radio
                        onClick={showRegister}
                        sx={{
                          color: grey[800],
                          "&.Mui-checked": {
                            color: grey[600],
                          },
                        }}
                      />
                    }
                    label="Registrujte se"
                  />
                  <FormControlLabel
                    id="rbLogin"
                    value="login"
                    control={
                      <Radio
                        onClick={showLogin}
                        sx={{
                          color: grey[800],
                          "&.Mui-checked": {
                            color: grey[600],
                          },
                        }}
                      />
                    }
                    label="Prijavite se"
                  />
                </RadioGroup>
              </div>
            </ThemeProvider>
            <form onSubmit={(e) => dataGet(e)} className={styleRegister}>
              <div className={styleRegister} id="DRegister">
                <ThemeProvider theme={theme}>
                  <div id="toggleAccess">
                    <FormLabel id="toggle-r-controlled-radio-buttons-group">
                      Odaberite tip člana
                    </FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="toggle-r-demo-row-radio-buttons-group-label"
                      name="toggle-r-row-radio-buttons-group"
                    >
                      <FormControlLabel
                        control={
                          <Radio
                            value="Student"
                            id="togglestudent"
                            onClick={showStudent}
                            sx={{
                              color: grey[800],
                              "&.Mui-checked": {
                                color: grey[600],
                              },
                            }}
                          />
                        }
                        label="Student"
                      />
                      <FormControlLabel
                        control={
                          <Radio
                            id="toggleprofessor"
                            value="Professor"
                            onClick={showProfessor}
                            sx={{
                              color: grey[800],
                              "&.Mui-checked": {
                                color: grey[600],
                              },
                            }}
                          />
                        }
                        label="Profesor"
                      />
                    </RadioGroup>
                  </div>

                  <div className={registerEveryone}>
                    <TextField
                      id="fname"
                      label="Ime"
                      variant="standard"
                      size="small"
                      value={name}
                      fullWidth
                      onChange={(event) => setName(event.target.value)}
                      // error={name === ""}
                      // helperText={
                      //   name === "" ? "Ovo polje ne sme biti prazno" : " "
                      // }
                      // error={nameError}
                    />
                    <TextField
                      id="fsurname"
                      label="Prezime"
                      variant="standard"
                      size="small"
                      value={surname}
                      fullWidth
                      onChange={(event) => setSurname(event.target.value)}
                      // error={surname === ""}
                      // helperText={
                      //   surname === "" ? "Ovo polje ne sme biti prazno" : " "
                      // }
                      // error={surnameError}
                    />
                    <TextField
                      id="fusername"
                      label="Korisničko ime"
                      variant="standard"
                      size="small"
                      value={username}
                      fullWidth
                      onChange={(event) => setUsername(event.target.value)}
                      // error={usernameError}
                      // helperText={
                      //   username === "" ? "Ovo polje ne sme biti prazno" : " "
                      // }
                    />
                    <TextField
                      id="femail"
                      label="E-mail adresa"
                      variant="standard"
                      size="small"
                      value={email}
                      fullWidth
                      onChange={(event) => setEmail(event.target.value)}
                      // error={emailError}
                      // helperText={
                      //   email === "" ? "Ovo polje ne sme biti prazno" : " "
                      // }
                    />
                    <TextField
                      id="fmakepswd"
                      label="Šifra"
                      type="password"
                      size="small"
                      variant="standard"
                      value={password}
                      fullWidth
                      onChange={(event) => setPassword(event.target.value)}
                      // error={passwordError}
                      // helperText={
                      //   password === "" ? "Ovo polje ne sme biti prazno" : " "
                      // }
                    />
                    <br />
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Pol
                    </FormLabel>
                    <RadioGroup
                      defaultValue="zenski"
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
                    <br />
                    <TextField
                      id="fbirthdate"
                      label="Datum rođenja"
                      type="date"
                      variant="standard"
                      size="small"
                      fullWidth
                      sx={{ width: 220 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(event) => setBirthdate(event.target.value)}
                      // error={birthdateError}
                      // helperText={
                      //   birthdate === "" ? "Ovo polje ne sme biti prazno" : " "
                      // }
                    />
                    <br />
                    <br />
                    <TextField
                      multiline
                      id="fopis"
                      label="Kratki opis"
                      size="small"
                      variant="outlined"
                      minRows={5}
                      fullWidth
                      onChange={(event) => setDescription(event.target.value)}
                      // error={descriptionError}
                      // helperText={
                      //   description === "" ? "Ovo polje ne sme biti prazno" : " "
                      // }
                    />
                  </div>
                  <div className={RegisterStudent} id="fRegisterStudent">
                    {/* <ThemeProvider theme={theme}>
                      <InputLabel id="faxprof">Izaberite fakultet</InputLabel>
                      <Select
                        id="faxprof"
                        variant="standard"
                        label="Izaberite fakultet"
                        value={faxid}
                        onChange={(e) => {
                          postaviFakultet(e);
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
                    </ThemeProvider> */}
                    <TextField
                      id="fcity"
                      label="Naziv grada"
                      variant="standard"
                      size="small"
                      value={city}
                      fullWidth
                      onChange={(event) => setCity(event.target.value)}
                    />

                    <FormLabel id="studies-row-radio-buttons-group-label">
                      Tip studija
                    </FormLabel>
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
                    <TextField
                      id="fyear"
                      label="Godina studija"
                      type="number"
                      fullWidth
                      InputProps={{
                        inputProps: { min: 1, max: 5 },
                      }}
                      variant="standard"
                    />

                    <Button
                      id="submitregistration"
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
                      Registruj se
                    </Button>

                    <br />
                    <br />
                  </div>
                  <div className={RegisterProfessor} id="fRegisterProfessor">
                    <TextField
                      id="fnastavnozvanje"
                      label="Nastavno zvanje"
                      variant="standard"
                      size="small"
                      value={nastavnoZvanje}
                      fullWidth
                      onChange={(event) =>
                        setNastavnoZvanje(event.target.value)
                      }
                    />
                    <TextField
                      id="fobrazovanje"
                      label="Obrazovanje"
                      variant="standard"
                      size="small"
                      value={obrazovanje}
                      fullWidth
                      onChange={(event) => setObrazovanje(event.target.value)}
                    />
                    <br />
                    <br />

                    <Button
                      id="submitregistration"
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
                      Registruj se
                    </Button>
                  </div>
                </ThemeProvider>
              </div>
            </form>
            <div className={styleAlert} id="ima">
              <Alert severity="success">Uspesno ste se registrovali!</Alert>
            </div>
          </div>

          <div className={styleLogin} id="DLogin">
            <Login />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterAndLogin;
