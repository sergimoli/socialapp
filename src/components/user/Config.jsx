import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/Global";
import { SerializeForm } from "../../helpers/SerializeForm";

export const Config = () => {
  const { auth, setAuth } = useAuth();
  const [saved, setSaved] = useState("not_saved");

  const updateUser = async (e) => {
    e.preventDefault();
    // console.log(auth);

    //token d'atuenticació
    const token = localStorage.getItem("token");

    //recollim dades del formulari
    const newDataUser = SerializeForm(e.target);
    delete newDataUser.file; //el borrem per que no li fa falta

    //actualitzar usuari  a la bbdd
    const request = await fetch(Global.url + "/user/update", {
      method: "PUT",
      body: JSON.stringify(newDataUser),
      headers: {
        "Content-type": "application/json",
        // Authorization: localStorage.getItem("token"),
        Authorization: token,
      },
    });
    const data = await request.json(); //el conviertim a objecte javascript usable
    if (data.status == "success") {
      delete data.user.password;
      setAuth(data.user);
      setSaved("saved");
      console.log(auth);
    } else {
      setSaved("error");
    }

    //pujada d'imatges
    const fileInput = document.querySelector("#file"); //seleccionem un eleemnt amb l'id = file
    if (data.status == "success" && fileInput.files[0]) {
      //recollir imatge a pujar
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);
      //peitició per enviar el fitxer
      const uploadRequest = await fetch(Global.url + "/user/upload", {
        method: "POST",
        body: formData,
        headers: {
          // "Content-Type": "application/json",
          Authorization: token,
          // Authorization: localStorage.getItem("token"),
        },
      });

      const uploadData = await uploadRequest.json();
      // console.log(uploadData);
      if (uploadData.status == "success") {
        delete uploadData.password;
        setAuth(uploadData.user);
        setSaved("saved");
      } else {
        setSaved("error");
      }
    }
  };
  return (
    <>
      <header className="content__header content__header--public">
        <h1 className="content__title">Config</h1>
      </header>
      <div className="content__posts">
        {saved == "saved" ? (
          <strong className="alert alert-success">user updated ok!</strong>
        ) : (
          ""
        )}
        {saved == "error" ? (
          <strong className="alert alert-danger">user not updated...</strong>
        ) : (
          ""
        )}
        <form className="config-form" onSubmit={updateUser}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            {/* jo en el backend estic esperant una propietat 'name' */}
            <input type="text" name="name" defaultValue={auth.name} />
          </div>
          <div className="form-group">
            <label htmlFor="surname">Surname</label>
            {/* jo en el backend estic esperant una propietat 'name' */}
            <input type="text" name="surname" defaultValue={auth.surname} />
          </div>
          <div className="form-group">
            <label htmlFor="nick">Nick</label>
            {/* jo en el backend estic esperant una propietat 'name' */}
            <input type="text" name="nick" defaultValue={auth.nick} />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            {/* jo en el backend estic esperant una propietat 'name' */}
            <textarea name="bio" defaultValue={auth.bio} />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            {/* jo en el backend estic esperant una propietat 'name' */}
            <input type="email" name="email" defaultValue={auth.email} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            {/* jo en el backend estic esperant una propietat 'name' */}
            <input type="password" name="password" />
          </div>

          <div className="form-group">
            <label htmlFor="file">Avatar</label>
            <div className="general-info__container-avatar">
              {auth.image != "default.png" && (
                <img
                  src={Global.url + "/user/avatar/" + auth.image}
                  className="container-avatar__img"
                  alt="Foto de perfil"
                />
              )}
              {auth.image == "default.png" && (
                <img
                  src={auth.avatar}
                  className="container-avatar__img"
                  alt="Foto de perfil"
                />
              )}
            </div>
            <br />
            <input type="file" name="file" id="file" />
          </div>
          <br />
          <input type="submit" value="Update" className="bnt-btn-success" />
        </form>
        <br />
      </div>
    </>
  );
};
