// import styled from "@emotion/styled";
import React from "react";
import Layout from "../components/layout/Layout";
import DetallesProducto from "../components/layout/DetallesProducto";
import useProductos from "../hooks/useProductos";

/* const Heading = styled.h1`
  color: red;s
`; */

export default function Populares() {
  const { productos } = useProductos("votos");

  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <div className="bg-white">
              {productos.map((producto) => (
                <DetallesProducto key={producto.id} producto={producto} />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
