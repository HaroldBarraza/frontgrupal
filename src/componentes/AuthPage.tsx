import { useState } from "react";
import axios from "axios";
import { authService } from "../service/auth";
import { useAuthStore } from "../store/useAuthStore";

interface AuthPageProps {
  onCancel?: () => void;
}

const obtenerErrorAuth = (error: unknown, mensaje: string) => {
  if (axios.isAxiosError(error)) {
    const detalle = error.response?.data?.detail;
    if (typeof detalle === "string") return detalle;
  }
  return mensaje;
};

export function AuthPage({ onCancel }: AuthPageProps) {
  const loginStore = useAuthStore((s) => s.login);
  const [modo, setModo] = useState<"Login" | "registro">("Login");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const cambiarModo = (nuevoModo: "Login" | "registro") => {
    setModo(nuevoModo);
    setError("");
    setMensaje("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    setMensaje("");
    try {
      if (modo === "registro") {
        await authService.register({ nombre, email, password });
        setMensaje("Registro completo, puedes iniciar sesión");
        setModo("Login");
        setNombre("");
        setPassword("");
      } else {
        await loginStore({ email, password });
      }
    } catch (err) {
      setError(
        obtenerErrorAuth(
          err,
          modo === "registro"
            ? "No se pudo completar el registro"
            : "Email o contraseña invalidos",
        ),
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <section className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cerrar"
            className="modal-close"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        )}

        <div className="auth-mark">B</div>
        <p className="eyebrow">TIENDA ONLINE</p>
        <h2>{modo === "Login" ? "Iniciar sesión" : "Crear cuenta"}</h2>
        <p>
          {modo === "Login"
            ? "Accede a tu cuenta para ver más información"
            : "Registrate para realizar tus compras"}
        </p>

        <div className="auth-tabs" role="tablist" aria-label="Autenticación">
          <button
            type="button"
            role="tab"
            aria-selected={modo === "Login"}
            onClick={() => cambiarModo("Login")}
            className={modo === "Login" ? "active" : ""}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={modo === "registro"}
            onClick={() => cambiarModo("registro")}
            className={modo === "registro" ? "active" : ""}
          >
            Registrarse
          </button>
        </div>

        <form className="auth-form" onSubmit={(e) => void handleSubmit(e)}>
          {modo === "registro" && (
            <label>
              Nombre
              <input
                className="auth-input"
                required
                value={nombre}
                placeholder="Ingresa tu nombre"
                onChange={(e) => setNombre(e.target.value)}
              />
            </label>
          )}

          <label>
            Email
            <input
              className="auth-input"
              required
              type="email"
              value={email}
              placeholder="correo@ejemplo.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Contraseña
            <input
              className="auth-input"
              required
              minLength={6}
              type="password"
              value={password}
              placeholder="Mínimo 6 caracteres"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && <div className="alert-error">{error}</div>}
          {mensaje && <div className="alert-success">{mensaje}</div>}

          <button
            type="submit"
            className="primary-button full"
            disabled={cargando}
          >
            {cargando
              ? "Procesando..."
              : modo === "Login"
                ? "Ingresar"
                : "Crear cuenta"}
          </button>
        </form>
      </section>
    </div>
  );
}