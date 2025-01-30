import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Admin/Dashboard";
import Navbar from "../components/Navbar";
import Musica from "../pages/Admin/Musica";

import Artistas from "../pages/Admin/Artista";
import Usuarios from "../pages/Admin/Usuarios";
import Ventas from "../pages/Admin/Ventas";

import Album from "../pages/Admin/Album";
import Perfil from "../pages/Admin/Perfil";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <>
            <Navbar />
            <Dashboard />
          </>
        }
      />
      <Route
        path="/artista"
        element={
          <>
            <Navbar />
            <Artistas />
          </>
        }
      />
      <Route
        path="/album"
        element={
          <>
            <Navbar />
            <Album />
          </>
        }
      />
      <Route
        path="/canciones"
        element={
          <>
            <Navbar />
            <Musica />
          </>
        }
      />

      <Route
        path="/ventas"
        element={
          <>
            <Navbar />
            <Ventas />
          </>
        }
      />
      <Route
        path="/usuarios"
        element={
          <>
            <Navbar />
            <Usuarios />
          </>
        }
      />

      <Route
        path="/perfil"
        element={
          <>
            <Navbar />
            <Perfil />
          </>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
