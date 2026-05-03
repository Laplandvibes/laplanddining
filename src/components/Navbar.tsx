import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

const navLinks = [
  { label: 'Restaurants', to: '/restaurants' },
  { label: 'Fine Dining', to: '/fine-dining' },
  { label: 'Midnight Sun', to: '/midnight-sun-dining' },
  { label: 'Food Story', to: '/food-history' },
  { label: 'Local Food', to: '/local-food' },
  { label: 'About', to: '/about' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-night/95 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="no-underline" aria-label="LaplandDining home">
            <Logo className="text-xl sm:text-2xl" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-medium transition-colors duration-200 text-sm tracking-wide no-underline ${
                  location.pathname === link.to
                    ? 'text-amber'
                    : 'text-white/70 hover:text-amber'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button — 44×44 px tap target (iOS HIG) */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2.5 -mr-1 text-white hover:text-amber transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-night/95 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block font-medium transition-colors duration-200 text-base no-underline px-3 py-3 rounded-lg min-h-[44px] flex items-center ${
                  location.pathname === link.to
                    ? 'text-amber bg-amber/10'
                    : 'text-white/70 hover:text-amber hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
