import React from "react";
import WindowPics from "./components/WindowPics";
import "./WelcomePage.css";
import Logo from "./components/img/logo.png";

const Welcome = () => {
  return (
    <section className="Welcome">
      <div id="box">
        <div id="bar">
          <span className="bartitle"></span>
          <WindowPics />
        </div>
        <div id="toplaDobrodoslica">
          <div id="slikaDobrodoslice">
            <img src={Logo} />
          </div>
          <div id="tekstDobrodoslice">
            <h1 className="h1welcome">Dobrodošli</h1>
            <h4 className="h2welcome">
              na studentski portal <span id="imeportala">nextGenStudent</span>
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Welcome;
