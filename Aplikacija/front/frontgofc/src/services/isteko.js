import React, { useEffect } from "react";
import axios from "axios";

useEffect(() => {
  const t = localStorage.getItem("token");
  axios.defaults.baseURL = "https://localhost:3000";
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status == 403) {
        localStorage.setItem("token", null);
      }
      return Promise.reject(error);
    }
  );
}, []);
