// IMPORTANTE: Importar parche DOM PRIMERO para prevenir errores de Portal
  import "./utils/dom-patch";

  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import "./styles/print.css"; // Estilos para impresión/PDF

  createRoot(document.getElementById("root")!).render(<App />);
  