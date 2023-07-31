import React, { useState, useEffect } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import axios from "axios";
import { FormLabel, Button, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { getUsername, getRole } from "../services/utils";
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
const TimeTable = () => {
  const [raspored, setRaspored] = useState([]);

  const username = getUsername();
  const getRaspored = () => {
    axios
      .get("https://localhost:7048/api/DataView/ReturnSchedule/" + username)
      .then((res) => {
        console.log(res.data);
        setRaspored(res.data);
      });
  };
  useEffect(() => {
    getRaspored();
  }, []);
  var curr = new Date(); // get current date
  var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
  var last = first + 6; // last day is the first day + 6

  var firstday = new Date(curr.setDate(first)).toLocaleDateString();
  var lastday = new Date(curr.setDate(last)).toLocaleDateString();

  return (
    <section className="tiemtavle">
      <ThemeProvider theme={theme}>
        <FormLabel>
          Tekuca nedelja {firstday} - {lastday}
        </FormLabel>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
              {raspored !== [] ? (
                raspored.map((r) => {
                  return (
                    <TableRow
                      key={r.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{r.predmet}</TableCell>
                      <TableCell>{r.pocetakDatum}</TableCell>
                      <TableCell>{r.pocetakVreme}</TableCell>
                      <TableCell>{r.zavrsetakVreme}</TableCell>
                      <TableCell>{r.cena}</TableCell>
                      <TableCell>
                        {ro === "Profesor" ? (
                          r.zakazan ? (
                            <>{r.student}</>
                          ) : (
                            <p>čas još uvek nije zakazan</p>
                          )
                        ) : ro === "Student" ? (
                          r.zakazan ? (
                            <>{r.student}</>
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
                              >
                                Upiši se na čas
                              </Button>
                            </ThemeProvider>
                          )
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
  );
};
export default TimeTable;
