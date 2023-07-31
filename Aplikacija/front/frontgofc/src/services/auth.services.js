import axios from "axios";

// const login = (username, password) => {
//   // useEffect(() => {}, [password]);

//   // var pass = document.getElementById("fpassword").value;
//   // var u = document.getElementById("fusername").value;
//   //const forma ={username: user};
//   // console.log(pass);
//   // console.log(u);
//   //   e.preventDefault();

//   return axios
//     .post("https://localhost:7048/api/Authenticate/Loginfunc/", {
//       username,
//       password,
//     })
//     .then((res) => {
//       console.log("Getting from : ", res.data);
//       localStorage.setItem("token", res.data.token);
//     })
//     .catch((err) => console.log(err.message));
// };

const logout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};

const login = (username, password) => {
  return axios
    .post("https://localhost:7048/api/Authenticate/Loginfunc/", {
      username,
      password,
    })
    .then((res) => {
      console.log("Getting from : ", res.data);
      if (res.data.token != undefined) {
        localStorage.setItem("token", res.data.token);
        window.location.reload();
      }
      else
      console.log("nema sifra bato");

      return res.data.token;
    })
    .catch((err) => console.log(err.message));
};
const getCurrentUser = () => {
  return localStorage.getItem("token");
};

const authService = {
  login,
  logout,
  getCurrentUser,
};
export default authService;
