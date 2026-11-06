import React, { Suspense, lazy } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const VirtualAssistant = lazy(() => import("./VirtualAssistant"));

function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Suspense fallback={null}>
        <VirtualAssistant />
      </Suspense>
    </>
  );
}

export default Layout;
