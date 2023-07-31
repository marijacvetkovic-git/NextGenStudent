import React, { useState, useEffect } from "react";
import "./NavBar.css";
import AuthService from "../services/auth.services";
import { getRole } from "../services/utils";

const NavBar = () => {
  const [currentUser, setCurrentUser] = useState("");
  const t = localStorage.getItem("token");
  const acc = getRole();
  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    window.location = "/";
  };

  return (
    <>
      {t === null ? (
        <>
          <div className="navbar">
            <div className="navbrand">
              <a href="/WelcomePage" id="navhome">
                nextGenStudent
              </a>
            </div>
            <div className="dd">
              <button className="ddbtn">Oglasi</button>
              <div className="ddoglasi">
                <a href="/RoomateAdPage">Cimer</a>
                <a href="/StudyBuddyAdPage">Studdy Buddy</a>
                <a href="/TutorAdPage">Tutor</a>
              </div>
            </div>
            <a href="/ProfessorPage" id="homp">
              Profesori
            </a>
            {!currentUser ? (
              <a href="/RegisterAndLoginPage" id="randl">
                Registrujte se/ Prijavite se
              </a>
            ) : (
              <a href="/RegisterAndLoginPage" id="randl" onClick={logOut}>
                Odjavite se
              </a>
            )}
          </div>
        </>
      ) : acc === "Student" ? (
        <>
          <div className="navbar">
            <div className="navbrand">
              <a href="/HomePage" id="navhome">
                nextGenStudent
              </a>
            </div>
            <div className="dd">
              <button className="ddbtn">Oglasi</button>
              <div className="ddoglasi">
                <a href="/RoomateAdPage">Cimer</a>
                <a href="/StudyBuddyAdPage">Studdy Buddy</a>
                <a href="/TutorAdPage">Tutor</a>
              </div>
            </div>
            <a href="/ProfessorPage" id="homp">
              Profesori
            </a>
            {/* <a href="../HomePage" id="homp">
              Home page test
            </a> */}
            <a href="/ProfilePage" id="homp">
              Profilna
            </a>
            {!currentUser ? (
              <a href="/RegisterAndLoginPage" id="randl">
                Registrujte se/ Prijavite se
              </a>
            ) : (
              <a href="/RegisterAndLoginPage" id="randl" onClick={logOut}>
                Odjavite se
              </a>
            )}
          </div>
        </>
      ) : acc === "Administrator" ? (
        <>
          <div className="navbar">
            <div className="navbrand">
              <a href="/WelcomePage" id="navhome">
                nextGenStudent
              </a>
            </div>
            <div className="dd">
              <button className="ddbtn">Oglasi</button>
              <div className="ddoglasi">
                <a href="/RoomateAdPage">Cimer</a>
                <a href="/StudyBuddyAdPage">Studdy Buddy</a>
                <a href="/TutorAdPage">Tutor</a>
              </div>
            </div>
            <a href="/ProfessorPage" id="homp">
              Profesori
            </a>
            <a href="/HomePage" id="homp">
              Naslovna
            </a>
            <a href="/AdminPage" id="homp">
              Administratorska strana
            </a>
            {!currentUser ? (
              <a href="/RegisterAndLoginPage" id="randl">
                Registrujte se/ Prijavite se
              </a>
            ) : (
              <a href="/RegisterAndLoginPage" id="randl" onClick={logOut}>
                Odjavite se
              </a>
            )}
          </div>
        </>
      ) : acc === "Profesor" ? (
        <>
          <div className="navbar">
            <div className="navbrand">
              <a href="/ProfilePage" id="navhome">
                nextGenStudent
              </a>
            </div>

            <a href="/ProfilePage" id="homp">
              Profilna
            </a>

            {!currentUser ? (
              <a href="/RegisterAndLoginPage" id="randl">
                Registrujte se/ Prijavite se
              </a>
            ) : (
              <a href="/RegisterAndLoginPage" id="randl" onClick={logOut}>
                Odjavite se
              </a>
            )}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
export default NavBar;
