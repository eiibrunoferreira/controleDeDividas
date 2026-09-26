import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Dividas from "./pages/Dividas";
import Pagos from "./pages/Pagos";
import AVencer from "./pages/AVencer";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";


// =========================================================
// PROTEÇÃO DAS ROTAS
// =========================================================

function ProtectedRoute({ children }) {

  const token =
  localStorage.getItem("@auth_token") ||
  sessionStorage.getItem("@auth_token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;

}


export default function App() {

  return (

    <BrowserRouter basename="/controleDeDividas/">

      <div className="min-h-screen text-white">

        <Routes>

          {/* ================================================= */}
          {/* AUTENTICAÇÃO */}
          {/* ================================================= */}

          <Route
            path="/"
            element={<Login />}
          />

          <Route
            path="/cadastro"
            element={<Cadastro />}
          />


          {/* ================================================= */}
          {/* APLICAÇÃO */}
          {/* ================================================= */}

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dividas"
            element={
              <ProtectedRoute>
                <Dividas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pagos"
            element={
              <ProtectedRoute>
                <Pagos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/a-vencer"
            element={
              <ProtectedRoute>
                <AVencer />
              </ProtectedRoute>
            }
          />

        </Routes>

      </div>

    </BrowserRouter>

  );

}