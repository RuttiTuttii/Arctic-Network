import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { DashboardPreview } from "./components/DashboardPreview";
import { NetworkSection } from "./components/NetworkSection";
import { Footer } from "./components/Footer";
import { Preloader } from "./components/Preloader";
import { GlassMenu } from "./components/GlassMenu";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { PricingPage } from "./pages/PricingPage";
import { LoginPage } from "./pages/LoginPage";
import { ChatPage } from "./pages/ChatPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { useState } from "react";

function HomePage() {
  return (
    <>
      <Hero />
      <NetworkSection />
      <Features />
      <DashboardPreview />
      <Footer />
    </>
  );
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="bg-black min-h-screen text-white">
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      {!isLoading && (
        <>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <GlassMenu />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}