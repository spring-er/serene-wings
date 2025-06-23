import { Suspense } from "react";
import { Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import Success from "./components/pages/success";
import Home from "./components/pages/home";
import ServicesPage from "./components/pages/services";
import AboutPage from "./components/pages/about";
import ContactPage from "./components/pages/contact";
import TestimonialsPage from "./components/pages/testimonials";
import { Toaster } from "./components/ui/toaster";
import { LoadingScreen } from "./components/ui/loading-spinner";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/success" element={<Success />} />
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </>
  );
}

function App() {
  return (
    <Suspense fallback={<LoadingScreen text="Loading application..." />}>
      <AppRoutes />
      <Toaster />
    </Suspense>
  );
}

export default App;
