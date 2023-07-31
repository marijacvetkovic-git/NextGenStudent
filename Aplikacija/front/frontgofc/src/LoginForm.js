import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomePage from "./HomePage";

import AuthService from "./services/auth.services";
import { getRole, getIsBanned } from "./services/utils";
import {
  createTheme,
  ThemeProvider,
  TextField,
  Button,
  FormControl,
  Alert,
} from "@mui/material";

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
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [styleAlert, changeAlert] = useState("sakrij");
  const showAlert = () => {
    changeAlert("prikazi");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setUsernameError(false);
    setPasswordError(false);
    if (username == "") {
      setUsernameError(true);
    }
    if (password == "") {
      setPasswordError(true);
    }
  };
  const handleLogin = async () => {
    try {
      await AuthService.login(username, password).then(
        () => {
          const r = getRole();
          const b = getIsBanned();
          console.log(b);

          if (b === "False") {
            if (r === "Student") {
              window.location = "/HomePage";
            } else if (r === "Profesor") {
              window.location = "/ProfilePage";
            } else if (r === "Administrator") {
              window.location = "/AdminPage";
            }
          } else if (b === "True") {
            changeAlert("prikazi");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form
      className="fLogin"
      onSubmit={(e) => {
        handleLogin();
        handleSubmit(e);
      }}
    >
      <FormControl>
        <ThemeProvider theme={theme}>
          <TextField
            fullWidth
            id="fusernameLog"
            label="Korisničko ime"
            variant="standard"
            size="small"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            // error={usernameError}
            // helperText={username === "" ? "Ovo polje ne sme biti prazno" : " "}
          />
          <TextField
            id="fpassword"
            label="Šifra"
            variant="standard"
            size="small"
            fullWidth
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <br />
          <br />
          <Button
            id="blogin"
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
            Prijavi se
          </Button>
          <div className={styleAlert} id="alertBanovan">
            <Alert severity="error">
              Banovani ste, prekršili ste uslove i pravila korišćenja! 🙁
            </Alert>
          </div>
        </ThemeProvider>
        {/* <button id="blogin" className="btn">
        Prijavi se
      </button> */}
      </FormControl>
    </form>
  );
};
export default Login;
