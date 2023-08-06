import { Navigate, Outlet } from "react-router-dom";
import { Header } from "./Header";
import SideBar from "./SideBar";
import useAuth from "../../../hooks/useAuth";

export const PrivateLayout = () => {
  const { auth, loading } = useAuth();
  if (loading) {
    return <h1>Charging...</h1>;
  } else {
    return (
      <>
        {/* Layout */}
        {/* capçalera */}
        <Header />
        {/* contingut princiapl */}
        {/* tots els components que carregui la ruta */}
        {/* si no està logejat no permet anar a social, per exemple. El forcem anar a login */}
        <section className="layout__content">
          {auth._id ? <Outlet /> : <Navigate to="/login" />}
        </section>

        {/* Barra lateral */}
        <SideBar />
      </>
    );
  }
};
