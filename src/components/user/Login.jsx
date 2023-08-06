import { useState } from "react";
import { Global } from "../../helpers/Global";
import { useForm } from "../../hooks/useForm";
import useAuth from "../../hooks/useAuth";
// import useAuth from "../../hooks/useAuth";

export const Login = () => {
  // const { shared } = useAuth();
  const { form, changed } = useForm({});
  const [logged, setLogged] = useState("not_sended");
  const { setAuth } = useAuth();
  const loginUser = async (e) => {
    e.preventDefault();
    console.log(form);
    // Dades del formulari
    const userToLogin = form;
    //Petició al backend
    const request = await fetch(Global.url + "/user/login", {
      method: "POST",
      body: JSON.stringify(userToLogin), //al ser objecte javascript no pot viatjar tal qual. per això el convertim a json.stringify
      headers: {
        "Content-type": "application/json",
      },
    });

    const data = await request.json(); //recollim les dades
    console.log(data);

    if (data.status == "success") {
      //Persisitir les dades al navegador (tindré accés sempre - estarà en el localstorage)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.findUser));
      setLogged("logged");

      //set dades en el auth
      setAuth(data.findUser);

      //redirecció (deixem un segon)
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setLogged("error");
    }
  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Login</h1>
      </header>
      <div className="content__posts">
        {logged == "logged" ? (
          <strong className="alert alert-success">
            user logged correctly!
          </strong>
        ) : (
          ""
        )}
        {logged == "error" ? (
          <strong className="alert alert-danger">
            user not logged, sorry...
          </strong>
        ) : (
          ""
        )}
        <form className="form-login" onSubmit={loginUser}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" onChange={changed} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" onChange={changed} />
          </div>
          <input type="submit" value="Indentify" className="btn btn-success" />
        </form>
      </div>
    </>
  );
};
