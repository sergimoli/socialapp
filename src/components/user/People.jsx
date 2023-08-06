import { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import { UserList } from "./UserList";
export const People = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  //s'executarà la primera vegada.
  useEffect(() => {
    getUsers(1);
    console.log("mother fucke!!!");
  }, []);

  const getUsers = async (nextPage = 1) => {
    //Efecte de càrrega
    setLoading(true);
    //petició treure usuaris
    const request = await fetch(Global.url + "/user/list/" + nextPage, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await request.json();

    // console.log("data", data);
    //crear estat per poder llistar-los
    if (data.users.docs && data.status == "success") {
      let newUsers = data.users.docs;
      if (users.length >= 1) {
        newUsers = [...users, ...data.users.docs]; //copiem el contingut d'un array a un altre.
        //o sigui: tots els usuaris que ja estiguissin a l'estat 'users' + els segúents que acabo d'obtneir. Formem un nou array.
      }

      setUsers(newUsers);
      setFollowing(data.user_following);
      console.log("data.user_following", data.user_following);
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
        <h1 className="content__title">People</h1>
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
