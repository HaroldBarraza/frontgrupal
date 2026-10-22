import { useState, useEffect } from "react";
import axios from "axios";
import api from "../libs/axios";
import { ProductCard } from "../componentes/ProductCard";
import { useAuthStore } from "../store/useAuthStore";
import type { Product } from "../types/Product";

const obtenerMensajeError = (error: unknown, mensajePorDefecto: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return "Solo acceso al admin!";
    }
    const detalle = error.response?.data?.detail;
    if (typeof detalle === "string") return detalle;
  }
  return mensajePorDefecto;
};

const inputClass =
  "w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400 font-medium";

export function ProductsPage() {
  const esAdmin = useAuthStore((s) => s.esAdmin());

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para Filtros y Búsqueda
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [productoEditando, setProductoEditando] = useState<Product | null>(null);
  const [accionando, setAccionando] = useState<number | null>(null);
  const [accionError, setAccionError] = useState("");

  // Petición a la API con Axios
  const cargarProducts = () => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch(() =>
        setError(
          "No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.",
        ),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargarProducts();
  }, []);

  // Extraer categorías únicas dinámicamente omitiendo valores nulos o vacíos
  const categories = [
    "all",
    ...new Set(
      products.map((p) => p.category).filter((cat): cat is string => !!cat), // Filtra null o undefined
    ),
  ];

  // Lógica de Filtrado Combinado (Buscador + Selector de Categoría)
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      // selectedCategory === "all" || product.category === selectedCategory;
      product.category === "BeluPapeleria";
      return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    console.log(`Agregar al carrito: ${product.name}`);
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Seguro que querés eliminar este producto?")) return;
    try {
      setAccionando(id);
      setAccionError("");
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setAccionError(
        obtenerMensajeError(err, "No se pudo eliminar el producto."),
      );
    } finally {
      setAccionando(null);
    }
  };

  const handleEditarSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productoEditando) return;
    try {
      setAccionando(productoEditando.id);
      setAccionError("");
      const { data } = await api.put<Product>(
        `/products/${productoEditando.id}`,
        {
          name: productoEditando.name,
          description: productoEditando.description,
          price: productoEditando.price,
          stock: productoEditando.stock,
          category: productoEditando.category,
          image_url: productoEditando.image_url,
        },
      );
      setProducts((prev) => prev.map((p) => (p.id === data.id ? data : p)));
      setProductoEditando(null);
    } catch (err) {
      setAccionError(obtenerMensajeError(err, "No se pudo editar el producto."));
    } finally {
      setAccionando(null);
    }
  };

  // 1. Renderizado en estado de Carga (Skeletons)
  if (loading) {
    return (
      <div className="state-block">
        <div className="spinner" />
        <p>Cargando catálogo de productos...</p>
      </div>
    );
  }

  // 2. Renderizado en estado de Error
  if (error) {
    return (
      <div className="error-block">
        <h2>Ocurrió un problema</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="primary-button full"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <section className="catalog-page">
      {/* Cabecera Principal y Controles */}
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">La colección</p>
          <h1>
            Marketplace <em>BeluPapeleria</em>
          </h1>
          <p>
            Explora nuestra variedad de productos disponibles (
            {filteredProducts.length}).
          </p>
        </div>

        {/* Contenedor de Buscador y Filtro Desplegable */}
        <div className="search-field">
          {/* Buscador */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Selector Desplegable de Categorías (Select) */}
          {/*
          <div className="relative w-full sm:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer appearance-none capitalize"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="capitalize text-gray-700 font-medium"
                >
                  {category === "all"
                    ? "📦 Todas las categorías"
                    : category.replace("-", " / ")}
                </option>
              ))}
            </select>

            
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          */}
        </div>
      </div>

      {accionError && <div className="alert-error">{accionError}</div>}

      {/* Grid de Productos */}
      {filteredProducts.length === 0 ? (
        <div className="empty-block">
          <p>No se encontraron productos en esta sección.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              esAdmin={esAdmin}
              onEditar={() => setProductoEditando({ ...product })}
              onEliminar={() => void handleEliminar(product.id)}
              accionesDeshabilitadas={accionando === product.id}
            />
          ))}
        </div>
      )}

      {esAdmin && productoEditando && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setProductoEditando(null)}
        >
          <section
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setProductoEditando(null)}
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

            <p className="eyebrow">MUTACIÓN PUT</p>
            <h2>Editar: {productoEditando.name}</h2>

            <form
              onSubmit={(e) => void handleEditarSubmit(e)}
              className="admin-form"
            >
              <label>
                Nombre
                <input
                  required
                  value={productoEditando.name}
                  onChange={(e) =>
                    setProductoEditando({
                      ...productoEditando,
                      name: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Categoría
                <input
                  value={productoEditando.category}
                  onChange={(e) =>
                    setProductoEditando({
                      ...productoEditando,
                      category: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Precio (S/.)
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={productoEditando.price}
                  onChange={(e) =>
                    setProductoEditando({
                      ...productoEditando,
                      price: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Stock
                <input
                  type="number"
                  min="0"
                  required
                  value={productoEditando.stock}
                  onChange={(e) =>
                    setProductoEditando({
                      ...productoEditando,
                      stock: Number(e.target.value),
                    })
                  }
                />
              </label>

              <label className="full">
                Descripción
                <input
                  value={productoEditando.description}
                  onChange={(e) =>
                    setProductoEditando({
                      ...productoEditando,
                      description: e.target.value,
                    })
                  }
                />
              </label>

              <label className="full">
                URL de imagen
                <input
                  type="url"
                  value={productoEditando.image_url ?? ""}
                  onChange={(e) =>
                    setProductoEditando({
                      ...productoEditando,
                      image_url: e.target.value,
                    })
                  }
                />
              </label>

              <div className="admin-form-footer">
                <button
                  type="button"
                  onClick={() => setProductoEditando(null)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={accionando === productoEditando.id}
                >
                  {accionando === productoEditando.id
                    ? "Guardando..."
                    : "Guardar cambios"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}