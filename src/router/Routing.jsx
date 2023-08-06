// import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { PublicLayout } from "../components/layout/public/PublicLayout";
import { Login } from "../components/user/Login";
import { Logout } from "../components/user/Logout";
import { Register } from "../components/user/Register";
import { PrivateLayout } from "../components/layout/private/PrivateLayout";
import { Feed } from "../components/publication/Feed";
import { AuthProvider } from "../context/AuthProvider";
import { People } from "../components/user/People";
import { Config } from "../components/user/Config";
import { Following } from "../components/follow/Following";
import { Followers } from "../components/follow/Followers";
import { Profile } from "../components/user/Profile";
// import { Register2 } from "../components/user/Register2";

export const Routing = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            {/* index es el primer component que carrega */}
            <Route index element={<Login />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route path="register" element={<Register />} />
          </Route>

          {/* Tot el que vagi per /social carregui altres components. */}
          <Route path="/social" element={<PrivateLayout />}>
            <Route index element={<Feed />}></Route>
            <Route index path="feed" element={<Feed />}></Route>
            <Route path="logout" element={<Logout />} />
            <Route path="people" element={<People />} />
            <Route path="config" element={<Config />} />
            <Route path="following/:userId" element={<Following />} />
            <Route path="followed/:userId" element={<Followers />} />
            <Route path="profile/:userId" element={<Profile />} />
          </Route>
          {/* route path * vol dir que quaalsevol ruta que no existeixi farà el que sigui... en aquest cas error 404 */}
          <Route
            path="*"
            element={
              <>
                <p>
                  <h1>Error 404</h1>
                  <Link to="/">Get back to Start </Link>
                </p>
              </>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
