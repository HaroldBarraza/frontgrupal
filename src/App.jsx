import { useEffect } from "react";
import { AuthPage } from "./componentes/AuthPage";
import { ProductsPage } from "./pages/ProductsPage";
import { useAuthStore } from "./store/useAuthStore";

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

  useEffect(() => {
    void verificarSesion();
  }, [verificarSesion]);

  if (verificandoSesion) {
    return (
      <div className="state-block">
        <div className="spinner" />
        <p>Verificando sesión...</p>
      </div>
    );
  }

  return (
    <>
      <header className="app-header">
        <div className="container app-header-inner">
          <a className="brand" href="/" aria-label="BeluPapeleria inicio">
            <span className="brand-mark">B</span>
            <span className="brand-text">
              Belu<span>Papeleria</span>
            </span>
          </a>

          <div className="header-actions">
            {autenticado ? (
              <>
                <span className="session-info">
                  <strong>{usuarioNombre || "Usuario"}</strong>
                  {usuarioRol && <small> · {usuarioRol}</small>}
                </span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="ghost-button"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <span className="session-info">Catálogo público</span>
                <button
                  type="button"
                  onClick={() => abrirAuth()}
                  className="primary-button"
                >
                  Iniciar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container">
        <ProductsPage />
      </main>

      {mostrarAuth && !autenticado && <AuthPage onCancel={cerrarAuth} />}
    </>
  );
}

export default App;