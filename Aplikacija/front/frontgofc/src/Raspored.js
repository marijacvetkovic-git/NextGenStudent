import React, { useState, useEffect } from "react";
import WindowPics from "./components/WindowPics";
import TimeTable from "./components/TimeTable";
import "./Register&LoginPage.css";
import { useNavigate } from "react-router-dom";
import {
  createTheme,
  ThemeProvider,
  TextField,
  Button,
  FormControl,
  Alert,
  Modal,
  Backdrop,
  Fade,
  Box,
  InputLabel,
  FormLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { getUsername, getUserId, getRole } from "./services/utils";
import { isCursorAtEnd } from "@testing-library/user-event/dist/utils";

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
  width: 300,
  borderRadius: "4px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const Raspored = () => {
  const token = localStorage.getItem("token");
  var usrid = getUserId();
  const usr = getUsername();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [predid, setPredid] = useState("");
  const [predmeti, setPredmeti] = useState([]);
  const [pnaziv, setPnaziv] = useState("");
  const [dp, setDatP] = useState("");
  const [vp, setVremeP] = useState("");
  const [vk, setVremeK] = useState("");

  const postaviDatumPocetka = (e) => {
    setDatP(e.target.value);
  };
  const postaviVremePocetka = (e) => {
    setVremeP(e.target.value);
  };
  const postaviVremeKraja = (e) => {
    setVremeK(e.target.value);
  };

  const addClass = (e) => {
    var price = e.target.cena.value;

    var datumC = new Date(e.target.datumCasa.value);
    var start = e.target.pocetak.value;
    var datumPocUp = `${datumC.getFullYear()}-${
      datumC.getMonth() + 1
    }-${datumC.getDate()}_${start}:00.0000000`;

    var end = e.target.kraj.value;
    var datumKrajUp = `${datumC.getFullYear()}-${
      datumC.getMonth() + 1
    }-${datumC.getDate()}_${end}:00.0000000`;

    console.log(price, datumPocUp, datumKrajUp);

    const cas = {
      price: price,
      start: datumPocUp,
      end: datumKrajUp,
      prof: usrid,
    };
    console.log(cas);
    axios
      .post("https://localhost:7048/api/Professor/AddClass2/", cas, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Getting from : ", res.i);
        console.log(res.data);
        console.log("unet cas");
      })
      .catch((error) => {
        console.log(error);
        console.log("nece..");
      });
  };
  var r = getRole();
  const t = localStorage.getItem("token");
  const navigate = useNavigate();
  useEffect(() => {
    if (t === null) navigate("/RegisterAndLoginPage", { replace: true });
  }, [t]);
  return (
    <>
      {r === "Profesor" ? (
        <section className="Welcome">
          <div id="boxTT">
            <div id="barTT">
              <span className="bartitle"></span>
              <WindowPics />
            </div>
            <ThemeProvider theme={theme}>
              <Button
                id="bNapraviRaspored"
                size="small"
                variant="outlined"
                color="neutral"
                sx={{
                  fontWeight: "bold",
                  letterSpacing: 1,
                  fontSize: 15,
                }}
                onClick={handleOpen}
              >
                Dodaj čas
              </Button>
              <Button
                id="bVratiSe"
                size="small"
                variant="outlined"
                color="neutral"
                sx={{
                  fontWeight: "bold",
                  letterSpacing: 1,
                  fontSize: 15,
                  marginLeft: "1rem",
                }}
                onClick={() => (window.location = "/ProfilePage")}
              >
                Vrati se nazad
              </Button>
            </ThemeProvider>
            <br />
            <br />
            <TimeTable />
          </div>
          <div className="modal-dodaj-raspored">
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
                  <ThemeProvider theme={theme}>
                    <form onSubmit={(e) => addClass(e)}>
                      <FormLabel id="dodaj-raspored">
                        Dodajte čas u raspored
                      </FormLabel>

                      <TextField
                        id="cena"
                        fullWidth
                        label="Unesite cenu:"
                        variant="standard"
                        size="small"
                        type="number"
                      />

                      <TextField
                        id="datumCasa"
                        label="Datum časa"
                        type="date"
                        variant="standard"
                        size="small"
                        fullWidth
                        sx={{ width: 220 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        id="pocetak"
                        label="Vreme početka časa"
                        type="time"
                        variant="standard"
                        size="small"
                        fullWidth
                        sx={{ width: 220 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        id="kraj"
                        label="Vreme kraja časa"
                        type="time"
                        variant="standard"
                        size="small"
                        fullWidth
                        sx={{ width: 220 }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <br />
                      <br />
                      <Button
                        id="SaveChanges"
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
        </section>
      ) : (
        (window.location = "/HomePage")
      )}
    </>
  );
};
export default Raspored;
