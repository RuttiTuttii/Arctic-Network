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
import { LanguageProvider } from "./contexts/LanguageContext";
import { useState } from "react";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "profile":
        return <RegisterPage onNavigate={setCurrentPage} />;
      case "explore":
      case "dashboard":
        return <DashboardPage />;
      case "inbox":
        return <PricingPage onNavigate={setCurrentPage} />;
      default:
        return (
          <>
            <Hero onNavigate={setCurrentPage} />
            <NetworkSection />
            <Features />
            <DashboardPreview onNavigate={setCurrentPage} />
            <Footer />
          </>
        );
    }
  };

  return (
    <LanguageProvider>
      <div className="bg-black min-h-screen text-white">
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
        {!isLoading && (
          <>
            {renderPage()}
            <GlassMenu onNavigate={setCurrentPage} currentPage={currentPage} />
          </>
        )}
      </div>
    </LanguageProvider>
  );
}