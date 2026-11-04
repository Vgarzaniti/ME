import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import VirtualAssistant from "./VirtualAssistant";

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <VirtualAssistant />
    </>
  );
}

export default Layout;
