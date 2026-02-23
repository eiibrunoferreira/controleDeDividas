import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dividas from "./pages/Dividas";
import Pagos from "./pages/Pagos";
import AVencer from "./pages/AVencer";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-900 text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dividas" element={<Dividas />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/a-vencer" element={<AVencer />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}