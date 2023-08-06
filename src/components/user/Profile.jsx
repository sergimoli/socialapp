import { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";
import { GetProfile } from "../../helpers/GetProfile";
import { Link, useParams } from "react-router-dom";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import { PublicationList } from "../publication/PublicationList";
export const Profile = () => {
  const [user, setUser] = useState({});
  const params = useParams();
  const [counters, setCounters] = useState({});
  const { auth } = useAuth();
  const [iFollow, setIFollow] = useState(false);
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);

  useEffect(() => {
    const getDataUser = async () => {
      let dataUser = await GetProfile(params.userId, setUser);
      console.log("mydarlling", dataUser);
      if (dataUser.following && dataUser.following._id) setIFollow(true);
    };
    getDataUser();
    getCounters();
    setMore(true);
    getPublications(1, true);
  }, [params]);

  const getCounters = async () => {
    const request = await fetch(
      Global.url + "/user/counters/" + params.userId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    const data = await request.json();
    console.log(data);
    if (data.following) setCounters(data);
  };

  const follow = async (userId) => {
    //petició al backend per guardar el follow
    const request = await fetch(Global.url + "/follow/save", {
      method: "POST",
      body: JSON.stringify({ followed: userId }),
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
    const data = await request.json();
    //quan esitigui tot correcte
    if (data.status == "success") setIFollow(true);
  };

  const unFollow = async (userId) => {
    //petició al backend per borrar el follow
    const request = await fetch(Global.url + "/follow/unfollow/" + userId, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
    const data = await request.json();
    //quan esitigui tot correcte
    if (data.status == "success") setIFollow(false);
  };

  const getPublications = async (nextPage = 1, newProfile = false) => {
    const request = await fetch(
      Global.url + "/publication/user/" + params.userId + "/" + nextPage,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    const data = await request.json();
    console.log("jejejej", data);
    if (data.status == "success") {
      let newPublications = data.publications.docs;
      if (!newProfile && publications.length >= 1) {
        newPublications = [...publications, ...data.publications.docs];
      }
      if (newProfile) {
        newPublications = data.publications.docs;
        setMore(true);
        setPage(1);
      }

      setPublications(newPublications);
      if (
        !newProfile &&
        newPublications.length >= data.publications.totalDocs
      ) {
        setMore(false);
      }
      if (data.publications.totalDocs <= 1) setMore(false);
      console.log("publications", publications);
    }
  };

  return (
    <>
      <header className="aside__profile-info">
        <div className="profile-info__general-info">
          <div className="general-info__container-avatar">
            {user.image != "default.png" && (
              <img
                src={Global.url + "/user/avatar/" + user.image}
                className="container-avatar__img"
                alt="profile picture"
              />
            )}
            {user.image == "default.png" && (
              <img
                src={avatar}
                className="container-avatar__img"
                alt="profile picture"
              />
            )}
          </div>

          <div className="general-info__container-names">
            <div className="container-names__name">
              <h1>
                {user.name} {user.surname}
              </h1>
              {user._id != auth._id && iFollow ? (
                <button
                  onClick={() => unFollow(user._id)}
                  className="content__button content__button--right post__button"
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => follow(user._id)}
                  className="content__button content__button--right"
                >
                  Follow
                </button>
              )}
            </div>
            <h2 className="container-names__nickname">{user.nick}</h2>
            <p>{user.bio}</p>
          </div>
        </div>

        <div className="profile-info__stats">
          <div className="stats__following">
            <Link
              to={"/social/following/" + user._id}
              className="following__link"
            >
              <span className="following__title">Following</span>
              <span className="following__number">
                {counters.following >= 1 ? counters.following : 0}
              </span>
            </Link>
          </div>
          <div className="stats__following">
            <Link
              to={"/social/followed/" + user._id}
              className="following__link"
            >
              <span className="following__title">Followers</span>
              <span className="following__number">
                {counters.followed >= 1 ? counters.followed : 0}
              </span>
            </Link>
          </div>

          <div className="stats__following">
            <Link
              to={"/social/profile/" + user._id}
              className="following__link"
            >
              <span className="following__title">Publications</span>
              <span className="following__number">
                {counters.publications >= 1 ? counters.publications : 0}
              </span>
            </Link>
          </div>
        </div>
      </header>
      <PublicationList
        publications={publications}
        getPublications={getPublications}
        page={page}
        setPage={setPage}
        more={more}
        setMore={setMore}
      />

      <br />
    </>
  );
};
