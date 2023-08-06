import { Navigate, Outlet } from "react-router-dom";
import { Header } from "./Header";
import useAuth from "../../../hooks/useAuth";

export const PublicLayout = () => {
  const { auth } = useAuth();
  return (
    <>
      {/* Layout */}
      {/* capçalera */}
      <Header />
      {/* contingut princiapl */}
      {/* tots els components que carregui la ruta --> quan posem <Outlet></Outlet> */}
      {/* no deixem entrar a login si ja està autentificat */}
      <section className="layout__content">
        {!auth._id ? <Outlet /> : <Navigate to="/social" />}
      </section>

      {/* Barra lateral */}
    </>
  );
};
