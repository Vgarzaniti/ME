import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="notfound">
      <h2>404 - Página no encontrada</h2>
      <p>La ruta que buscas no existe.</p>
      <Link to="/" className="btn">
        Volver a Home
      </Link>
    </section>
  );
}

export default NotFound;
