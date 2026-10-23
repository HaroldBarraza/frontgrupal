import React, { useState } from "react";
import type { Product } from "../types/Product";

const PALETTE = ["coral", "lavender", "butter", "sky", "mint", "rose"] as const;
const EMOJIS = ["✦", "✎", "✿", "▦", "✧", "♡"] as const;

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  esAdmin?: boolean;
  accionesDeshabilitadas?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  esAdmin = false,
  accionesDeshabilitadas = false,
}) => {
  const { name, description, price, stock, category, image_url } = product;
  const [imgFailed, setImgFailed] = useState(false);

  const formattedCategory = category ? category.replace(/-/g, " / ") : "General";
  const isOutOfStock = stock === 0;
  const paletteIndex = Math.abs(product.id) % PALETTE.length;
  const paletteClass = PALETTE[paletteIndex];
  const emoji = EMOJIS[paletteIndex];
  const showImage = !!image_url && !imgFailed;

  return (
    <article className="product-card">
      <div className={`product-image ${paletteClass}`}>
        {showImage ? (
          <img
            src={image_url}
            alt={name || "Producto"}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="product-placeholder">{emoji}</span>
        )}

        <span className="product-category">{formattedCategory}</span>

        {isOutOfStock && (
          <div className="product-out-of-stock">
            <span>Agotado</span>
          </div>
        )}
      </div>

      <div className="product-info">
        <div>
          <h3>{name}</h3>
          <p>{description || "—"}</p>
          <div
            className={`product-stock ${
              isOutOfStock ? "out" : stock <= 5 ? "low" : ""
            }`}
          >
            {isOutOfStock ? "Sin stock" : `${stock} disponibles`}
          </div>
        </div>
        <strong>S/ {parseFloat(price).toFixed(2)}</strong>
      </div>

      {esAdmin ? (
        <div className="product-actions">
          <button
            type="button"
            disabled={accionesDeshabilitadas}
            className="edit"
          >
            Editar
          </button>
          <button
            type="button"
            disabled={accionesDeshabilitadas}
            className="delete"
          >
            {accionesDeshabilitadas ? "..." : "Eliminar"}
          </button>
        </div>
      ) : (
        <div className="product-buy">
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Agotado" : "Agregar"}
          </button>
        </div>
      )}
    </article>
  );
};