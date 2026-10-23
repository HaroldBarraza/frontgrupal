import { useEffect, useState, useMemo } from "react";
import api from "../libs/axios";
import GraficaCategoria from "../componentes/GraficaCategoria";
import type { Product } from "../types/Product";

interface PaginaReportesProps {
  onClose: () => void; // Obligatorio para poder cerrar la ventana emergente
}

export default function PaginaReportes({ onClose }: PaginaReportesProps) {
  const [productos, setProductos] = useState<Product[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function obtenerProductos() {
      try {
        const respuesta = await api.get("/products");
        setProductos(respuesta.data || respuesta);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setCargando(false);
      }
    }
    obtenerProductos();
  }, []);

  const datosGrafica = useMemo(() => {
    if (!productos || productos.length === 0) return [];
    const conteo: Record<string, number> = {};
    productos.forEach((p) => {
      const cat = p.category || "Sin Categoría";
      conteo[cat] = (conteo[cat] || 0) + 1;
    });
    return Object.entries(conteo).map(([cat, total]) => ({
      categoria: cat,
      total,
    }));
  }, [productos]);

  return (
    /* 1. Fondo oscuro traslúcido que cubre toda la pantalla */
    <div
      onClick={onClose} // Cierra el modal si haces clic fuera de la tarjeta
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)", // Difumina el catálogo de fondo
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999, // Asegura que esté por encima de todo
      }}
    >
      {/* 2. Tarjeta blanca contenedora del gráfico */}
      <div
        onClick={(e) => e.stopPropagation()} // Evita que al hacer clic dentro del gráfico se cierre el modal
        style={{
          background: "#ffffff",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #e5e7eb",
          width: "90%",
          maxWidth: "750px",
          position: "relative",
        }}
      >
        {/* Cabecera del Modal */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
          }}
        >
          <div>
            <h3 style={{ margin: 0, color: "#111827", fontSize: "20px" }}>
              Reportes del Sistema
            </h3>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              Resumen de productos por categoría
            </p>
          </div>

          {/* Botón X para cerrar */}
          <button
            onClick={onClose}
            style={{
              background: "#f3f4f6",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              color: "#4b5563",
              padding: "6px 12px",
              borderRadius: "50%",
              fontWeight: "bold",
            }}
          >
            ✕
          </button>
        </div>

        {/* Renderizado interno del gráfico o estado de carga */}
        {cargando ? (
          <div
            style={{
              height: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#6b7280",
            }}
          >
            Cargando estadísticas...
          </div>
        ) : (
          <GraficaCategoria datos={datosGrafica} />
        )}
      </div>
    </div>
  );
}
