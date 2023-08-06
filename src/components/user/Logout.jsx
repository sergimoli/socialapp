import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export const Logout = () => {
  const navigate = useNavigate();
  const { setAuth, setCounters } = useAuth();
  useEffect(() => {
    //buidar el localstorage
    localStorage.clear();
    //setear estats globals a buit
    setAuth({});
    setCounters({});
    //navigate al login
    navigate("/login");
  });
  return <h1>closing session...</h1>;
};
