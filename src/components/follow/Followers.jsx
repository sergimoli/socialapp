import { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import { UserList } from "../user/UserList";
import { useParams } from "react-router-dom";
import { GetProfile } from "../../helpers/GetProfile";
export const Followers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({});

  const params = useParams();

  //s'executarà la primera vegada.
  useEffect(() => {
    getUsers(1);
    GetProfile(params.userId, setUserProfile);
  }, []);

  const getUsers = async (nextPage = 1) => {
    //Efecte de càrrega
    setLoading(true);
    //treure userId de la url
    const userId = params.userId;

    //petició treure usuaris
    const request = await fetch(
      Global.url + "/follow/followers/" + userId + "/" + nextPage,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    const data = await request.json();

    console.log("tete", data);

    //recorrer i netejar follows per quedarme amb followed
    let cleanUsers = [];

    data.follows.docs.forEach((follow) => {
      cleanUsers = [...cleanUsers, follow.user]; //follow.user son els que em segueixen a mi.
    });
    data.users = cleanUsers;
    console.log("uuuusisisisi", data.users);

    // console.log("data", data);
    //crear estat per poder llistar-los
    // if (data.users.docs && data.status == "success") {
    console.log("aa1", data.user_following);
    // console.log("aa2", data.users.docs);

    if (data.users && data.status == "success") {
      let newUsers = data.users;
      if (users.length >= 1) {
        newUsers = [...users, ...data.users]; //copiem el contingut d'un array a un altre.
        //o sigui: tots els usuaris que ja estiguissin a l'estat 'users' + els segúents que acabo d'obtneir. Formem un nou array.
      }

      console.log("kaka", newUsers);

      setUsers(newUsers);
      setFollowing(data.user_following);
      console.log("data.follows", data.follows);
      setLoading(false);
      // console.log(following);
      // console.log(users);
      // console.log(data.users);
    }
    //paginació

    if (data.users.page == data.users.totalPages) setMore(false);
  };

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">
          Followers from {userProfile.name} {userProfile.surname}:
        </h1>
      </header>
      <UserList
        users={users}
        getUsers={getUsers}
        following={following}
        setFollowing={setFollowing}
        more={more}
        loading={loading}
        page={page}
        setPage={setPage}
      />

      <br />
    </>
  );
};
