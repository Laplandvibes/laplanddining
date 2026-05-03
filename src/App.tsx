import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import SharedFooter from '../../shared/Footer';
import SharedCookieBanner from '../../shared/CookieBanner';
import NewsletterPopup from './components/NewsletterPopup';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import FineDining from './pages/FineDining';
import About from './pages/About';
import FoodHistory from './pages/FoodHistory';
import LocalFood from './pages/LocalFood';
import MidnightSunDining from './pages/MidnightSunDining';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import CookiePolicy from './pages/CookiePolicy';

const pillarLinks = [
  { name: 'Restaurants', href: '/restaurants' },
  { name: 'Fine Dining', href: '/fine-dining' },
  { name: 'Midnight Sun Dining', href: '/midnight-sun-dining' },
  { name: 'Food Story', href: '/food-history' },
  { name: 'Local Food', href: '/local-food' },
];

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return; // honour anchor jumps from in-page links
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-night text-white">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/fine-dining" element={<FineDining />} />
          <Route path="/midnight-sun-dining" element={<MidnightSunDining />} />
          <Route path="/food-history" element={<FoodHistory />} />
          <Route path="/local-food" element={<LocalFood />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
        </Routes>
      </main>
      <SharedFooter pillarLinks={pillarLinks} />
      <SharedCookieBanner consentKey="laplanddining_cookie_consent" />
      <NewsletterPopup />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
