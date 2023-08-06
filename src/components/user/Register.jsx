import { useState } from "react";
import { Global } from "../../helpers/Global";
import { useForm } from "../../hooks/useForm";

export const Register = () => {
  const { form, changed } = useForm({});
  const [saved, setSaved] = useState("not_sended");
  const saveUser = async (e) => {
    e.preventDefault(); //prevenir actualització pantall
    const newUser = form; //recollir dades del formulari
    console.log(newUser);
    const request = await fetch(Global.url + "/user/register", {
      method: "POST", //POST per que anem a registrar nou usuari.
      body: JSON.stringify(newUser), //AIXÍ si que ho podem enviar per paràmetres.
      headers: {
        "Content-type": "application/json",
      },
    });

    const data = await request.json(); //la request per que sigui legible (json) . posem el await per que ha d'esperar la resposta.
    console.log(data);
    // console.log(data);
    if (data.status == "success") {
      setSaved("saved");
    } else {
      setSaved("error");
    }
  };

  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Register</h1>
      </header>
      <div className="content__posts">
        {saved == "saved" ? (
          <strong className="alert alert-success">user registered ok!</strong>
        ) : (
          ""
        )}
        {saved == "error" ? (
          <strong className="alert alert-danger">user not registered...</strong>
        ) : (
          ""
        )}
        <form className="register-form" onSubmit={saveUser}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            {/* jo en el backend estic esperant una propietat 'name' */}
            <input type="text" name="name" onChange={changed} />
          </div>
          <div className="form-group">
            <label htmlFor="surname">Surname</label>
            {/* jo en el backend estic esperant una propietat 'name' */}
            <input type="text" name="surname" onChange={changed} />
          </div>
          <div className="form-group">
            <label htmlFor="nick">Nick</label>
            {/* jo en el backend estic esperant una propietat 'name' */}
            <input type="text" name="nick" onChange={changed} />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            {/* jo en el backend estic esperant una propietat 'name' */}
            <input type="email" name="email" onChange={changed} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            {/* jo en el backend estic esperant una propietat 'name' */}
            <input type="password" name="password" onChange={changed} />
          </div>
          <input type="submit" value="Register" className="bnt-btn-success" />
        </form>
      </div>
    </>
  );
};
