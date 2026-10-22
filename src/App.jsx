import { ProductsPage } from "./pages/ProductsPage";
import { useAuthStore } from "./store/useAuthStore";
import "./App.css";

function App() {
  const autenticado = useAuthStore((s) => s.autenticado);
  const verificandoSesion = useAuthStore((s) => s.verificandoSesion);
  const usuarioNombre = useAuthStore((s) => s.usuarioNombre);
  const usuarioRol = useAuthStore((s) => s.usuarioRol);
  const mostrarAuth = useAuthStore((s) => s.mostrarAuth);
  const verificarSesion = useAuthStore((s) => s.verificarSesion);
  const logout = useAuthStore((s) => s.logout);
  const abrirAuth = useAuthStore((s) => s.abrirAuth);
  const cerrarAuth = useAuthStore((s) => s.cerrarAuth);

  return (
    <>
      <ProductsPage />
    </>
  );
}

export default App;
