import { Link } from "react-router-dom";
import avatar from "../../assets/img/user.png";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
export const UserList = ({
  users,
  getUsers,
  following,
  setFollowing,
  more,
  loading,
  page,
  setPage,
}) => {
  const { auth } = useAuth();

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
    if (data.status == "success") {
      //actualitzar estat following, afegint el nou follou
      console.log("puta!");
      console.log("following", following);
      setFollowing([...following, userId]);
    }
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
    if (data.status == "success") {
      //actualitzar estat following, filtrant les dades per eliminar al antic userId que acabo de deixar de seguir.
      const filterFollowings = following.filter(
        (followingUserId) => userId != followingUserId
      ); //aquií creo un array nou amb els usuaris que no siguin el que jo acabo de seguir.
      setFollowing(filterFollowings);
    }
  };

  const nextPage = () => {
    const next = page + 1;
    setPage(next);
    //si li posem directament getUsers(); veiem el retard que hi ha amb l'estat (asíncron)
    getUsers(next);
    console.log(page, next);
  };

  return (
    <>
      <div className="content__posts">
        {users?.map((user) => {
          return (
            <article className="posts__post" key={user._id}>
              <div className="post__container">
                <div className="post__image-user">
                  <Link
                    to={"/social/profile/" + user._id}
                    className="post__image-link"
                  >
                    {user.image != "default.png" && (
                      <img
                        src={Global.url + "/user/avatar/" + user.image}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                    {user.image == "default.png" && (
                      <img
                        src={avatar}
                        className="post__user-image"
                        alt="Foto de perfil"
                      />
                    )}
                  </Link>
                </div>

                <div className="post__body">
                  <div className="post__user-info">
                    <Link
                      to={"/social/profile/" + user._id}
                      className="user-info__name"
                    >
                      {user.name} {user.surname}
                    </Link>
                    <span className="user-info__divider"> | </span>
                    <Link
                      to={"/social/profile/" + user._id}
                      className="user-info__create-date"
                    >
                      <ReactTimeAgo date={user.create_at} locale="en-US" />
                    </Link>
                  </div>

                  <h4 className="post__content">{user.bio}</h4>
                </div>
              </div>

              {user._id != auth._id && (
                <div className="post__buttons">
                  {!following.includes(user._id) && (
                    <button
                      className="post__button post__button--green"
                      onClick={() => follow(user._id)}
                    >
                      Follow
                    </button>
                  )}
                  {following.includes(user._id) && (
                    <button
                      className="post__button "
                      onClick={() => unFollow(user._id)}
                    >
                      Unfollow
                    </button>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
      {loading ? <div> charging... </div> : ""}
      {more && (
        <div className="content__container-btn">
          <button className="content__btn-more-post" onClick={nextPage}>
            See more publications
          </button>
        </div>
      )}
    </>
  );
};
