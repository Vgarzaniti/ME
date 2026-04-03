import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <p>
          © {new Date().getFullYear()} Valentín Garzaniti — Built with <span className="accent">React</span> & ❤️
        </p>
      </footer>
    </>
  );
}

export default Layout;
