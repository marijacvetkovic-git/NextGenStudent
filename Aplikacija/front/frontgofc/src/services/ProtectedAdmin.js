import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { getRole } from "./utils";
const ProtectedAdmin = () => {
  var r = getRole();
  const [admin, setAdmin] = useState(r === "Administrator" ? true : null);

  return admin ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedAdmin;
