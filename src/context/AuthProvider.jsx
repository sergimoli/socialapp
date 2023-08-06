import { createContext, useEffect, useState } from "react";
import { Global } from "../helpers/Global";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  //   const [shared, setShared] = useState("shared in all components");
  const [auth, setAuth] = useState({});
  const [counters, setCounters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authUser();
    console.log("entro aqui");
  }, []);
  const authUser = async () => {
    //treure dades de l'usuarui identificat del localstorage
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    //comporbar si tinc token i usuari
    if (!token || !user) {
      setLoading(false);
      return false;
    }

    console.log(user);
    //tranformar les dades a un objecte de javascript
    const userObj = JSON.parse(user);
    const userId = userObj.id;
    console.log(userId);

    //petició ajax al backed que comprobi el ttoken i que em retorni les dades de l'usuari
    const request = await fetch(Global.url + "/user/profile/" + userId, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    });
    const data = await request.json();
    //Petició pels contadors
    const requestCounters = await fetch(
      Global.url + "/user/counters/" + userId,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: token,
        },
      }
    );
    const dataCounter = await requestCounters.json();
    //setear l'estat del auth
    setAuth(data.user);
    setCounters(dataCounter);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        // shared,
        auth,
        setAuth,
        counters,
        setCounters,
        loading,
      }}
    >
      {/* component fill que va a carregar quan jo utilitzi el context */}
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
