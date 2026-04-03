import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/home"));
const AboutPage = lazy(() => import("./pages/about"));
const ProjectsPage = lazy(() => import("./pages/projects"));
const ContactPage = lazy(() => import("./pages/contact"));
const NotFound = lazy(() => import("./pages/notfound"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loader">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
