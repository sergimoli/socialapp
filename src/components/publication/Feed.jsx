import { useEffect, useState } from "react";
import avatar from "../../assets/img/user.png";

import { Link, useParams } from "react-router-dom";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";
import { PublicationList } from "../publication/PublicationList";

// import useAuth from "../../hooks/useAuth";
export const Feed = () => {
  const params = useParams();
  const { auth } = useAuth();
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);

  useEffect(() => {
    getPublications(1, false);
  }, []);
  const getPublications = async (nextPage = 1, showNews = false) => {
    if (showNews) {
      setPublications([]);
      setPage(1);
      nextPage = 1;
    }
    const request = await fetch(Global.url + "/publication/feed/" + nextPage, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });
    const data = await request.json();
    console.log("jejejej", data);
    if (data.status == "success") {
      let newPublications = data.publications.docs;
      if (!showNews && publications.length >= 1) {
        newPublications = [...publications, ...data.publications.docs];
      }

      setPublications(newPublications);
      if (!showNews && publications.length >= data.publications.totalDocs) {
        setMore(false);
      }
      if (data.publications.totalDocs <= 1) setMore(false);
      console.log("publications", publications);
    }
  };
  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Timeline</h1>
        <button
          className="content__button"
          onClick={() => getPublications(1, true)}
        >
          Show more
        </button>
      </header>

      <PublicationList
        publications={publications}
        getPublications={getPublications}
        page={page}
        setPage={setPage}
        more={more}
        setMore={setMore}
      />
    </>
  );
};
