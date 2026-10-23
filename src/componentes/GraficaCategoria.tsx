import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface DataGrafica {
  categoria: string;
  total: number;
}

export default function GraficaCategoria(props: { datos: DataGrafica[] }) {
  const datos = props.datos;
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "700px",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={datos}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          {/* 4. Ojo con las mayúsculas: el campo en tus datos es 'categoria' en minúscula */}
          <XAxis dataKey="categoria" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* 5. Eliminamos la barra 'x' (no existe en tus datos) y corregimos 'total' a minúscula */}
          <Bar dataKey="total" fill="#fa9183" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
