import React, { useEffect, useState } from "react";
import "./App.css";
import ReactDom from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./WelcomePage";
import NavBar from "./components/NavBar";
import RegisterAndLogin from "./RegisterAndLoginPage";
import HomePage from "./HomePage";
import ProfilePage from "./ProfilePage";

import RoomateAdPage from "./Ads/RoomatesAdPage";
import StudyBuddyAdPage from "./Ads/StudyBuddyAdPage";
import TutorAdPage from "./Ads/TutorAdPage";
import ProfessorPage from "./services/ProfessorPage";
import View from "./services/View";
import AdminPage from "./AdminPage";
import Raspored from "./Raspored";
import io from "socket.io-client";
import Chat from "./components/Chat";
import "./components/Chat.css";
import Login from "./LoginForm";

import ProtectedAdmin from "./services/ProtectedAdmin.js";
import BannedPage from "./components/BannedPage";

//  const socket = io.connect("http://localhost:3001");
function App() {
  //iz loc token ako nije null onda moze da vrati usr ako ne redirect na login

  // if (!window.localStorage.getItem("token")) {
  //   window.localStorage.removeItem("token");

  //   // window.location.reload();
  // }

  //var token = localStorage.getItem("token");

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  // const joinRoom = () => {
  //   if (username !== "" && room !== "") {
  //     socket.emit("join_room", room);
  //     setShowChat(true);
  //   }
  // };
  return (
    <section className="glavno">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/HomePage" element={<HomePage />} />
          <Route exact path="/" element={<Welcome />} />
          <Route path="//WelcomePage" element={<Welcome />} />
          <Route path="/RegisterAndLoginPage" element={<RegisterAndLogin />} />
          <Route path="/RoomateAdPage" element={<RoomateAdPage />} />
          <Route path="/TutorAdPage" element={<TutorAdPage />} />
          <Route path="/StudyBuddyAdPage" element={<StudyBuddyAdPage />} />
          <Route path="/ProfessorPage" element={<ProfessorPage />} />
          <Route path="/ProfilePage" element={<ProfilePage />} />
          <Route path="/ProfilePage/:id/:role" element={<View />} />
          <Route path="/BannedPage/:id" element={<BannedPage />} />
          <Route path="/LoginForm" element={<Login />}></Route>
          <Route exact path="/" element={<ProtectedAdmin />}>
            <Route path="/AdminPage" element={<AdminPage />} />
          </Route>
          <Route path="/Raspored" element={<Raspored />}></Route>
        </Routes>
      </Router>
      {/* <div className="App">
        {!showChat ? (
          <div className="joinChatContainer">
            <input
              type="text"
              placeholder="John..."
              onChange={(event) => {
                setUsername(event.target.value);//KO SALJE STAVLJAS
              }}
            />
            <input
              type="text"
              placeholder="Room ID..."
              onChange={(event) => {
                setRoom(event.target.value);
              }}
            />
            <button className="btnJoin" onClick={joinRoom}>
              Join A Room
            </button>
          </div>
        ) : (
          <Chat socket={socket} username={username} room={room} />
        )}
      </div> */}
    </section>
  );
}

export default App;
