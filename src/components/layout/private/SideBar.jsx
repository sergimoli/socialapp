import { Link, NavLink } from "react-router-dom";
import avatar from "../../../assets/img/user.png";
import { Global } from "../../../helpers/Global";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "../../../hooks/useForm";
import { useState } from "react";
export default function SideBar() {
  const { auth, counters } = useAuth();
  const { form, changed } = useForm({});
  const [stored, setStored] = useState("not_stored");
  const savePublication = async (e) => {
    e.preventDefault();

    //recollir dades del formulari
    let newPublication = form; //així tenim les dades del formulari.
    newPublication.user = auth._id;

    //fer request per guardar a la bdd
    const request = await fetch(Global.url + "/publication/save", {
      method: "POST",
      body: JSON.stringify(newPublication),
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    //mostrar missatge
    if (data.status == "success") {
      setStored("stored");
    } else {
      setStored("error");
    }

    console.log(auth, counters);

    //pujar la imatge
    const fileInput = document.querySelector("#file");
    if (data.status == "success" && fileInput.files[0]) {
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);
      console.log("fuck me", data);

      const uploadRequest = await fetch(
        Global.url + "/publication/upload/" + data.saveNewPublication._id,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const uploadData = await uploadRequest.json();
      console.log(uploadData);
      if (uploadData.status == "success") {
        setStored("stored");
      } else {
        setStored("error");
      }
    }
    // if ((data.status = "success" && uploadData.status == "success")) {
    const myForm = document.querySelector("#publication-form");
    myForm.reset(); //netejem lo que em penjat.
    // }
  };
  return (
    <>
      <aside className="layout__aside">
        <header className="aside__header">
          <h1 className="aside__title">Hi, {auth.name}!</h1>
        </header>

        <div className="aside__container">
          <div className="aside__profile-info">
            <div className="profile-info__general-info">
              <div className="general-info__container-avatar">
                {auth.image != "default.png" && (
                  <img
                    src={Global.url + "/user/avatar/" + auth.image}
                    className="container-avatar__img"
                    alt="profile picture"
                  />
                )}
                {auth.image == "default.png" && (
                  <img
                    src={avatar}
                    className="container-avatar__img"
                    alt="profile picture"
                  />
                )}
              </div>

              <div className="general-info__container-names">
                <NavLink
                  to={"/social/profile/" + auth._id}
                  className="container-names__name"
                >
                  {auth.name} {auth.surname}
                </NavLink>
                <p className="container-names__nickname">{auth.nick}</p>
              </div>
            </div>

            <div className="profile-info__stats">
              <div className="stats__following">
                <Link to={"following/" + auth._id} className="following__link">
                  <span className="following__title">Following</span>
                  <span className="following__number">
                    {counters.following}
                  </span>
                </Link>
              </div>
              <div className="stats__following">
                <Link to={"followed/" + auth._id} className="following__link">
                  <span className="following__title">Followers</span>
                  <span className="following__number">{counters.followed}</span>
                </Link>
              </div>

              <div className="stats__following">
                <NavLink
                  to={"/social/profile/" + auth._id}
                  className="following__link"
                >
                  <span className="following__title">Publications</span>
                  <span className="following__number">
                    {counters.publications}
                  </span>
                </NavLink>
              </div>
            </div>
          </div>

          <div className="aside__container-form">
            {stored == "stored" ? (
              <strong className="alert alert-success">ok publicated</strong>
            ) : (
              ""
            )}
            {stored == "error" ? (
              <strong className="alert alert-danger">
                NOT publicated, sorry...
              </strong>
            ) : (
              ""
            )}
            <form
              id="publication-form"
              className="container-form__form-post"
              onSubmit={savePublication}
            >
              <div className="form-post__inputs">
                <label htmlFor="text" className="form-post__label">
                  What are you thinking today?
                </label>
                <textarea
                  name="text"
                  className="form-post__textarea"
                  onChange={changed}
                ></textarea>
              </div>

              <div className="form-post__inputs">
                <label htmlFor="file" className="form-post__label">
                  Upload a picture
                </label>
                <input
                  type="file"
                  name="file"
                  id="file"
                  className="form-post__image"
                />
              </div>

              <input
                type="submit"
                value="Send"
                className="form-post__btn-submit"
              />
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
