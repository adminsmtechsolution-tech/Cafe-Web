import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Coffee, Menu as MenuIcon, X, MapPin, Phone, ShoppingBag, User, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useSecretClicks } from '../../hooks/useSecretClicks';
import { useCart } from '../../context/CartContext';
import { useCustomerAuth } from '../../context/CustomerAuthContext';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const { totalItems, openCart } = useCart();
  const { user, logout } = useCustomerAuth();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Track scroll position for header shadow / backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = useSecretClicks({
    clicks: 5,
    windowMs: 3000,
    onTrigger: () => {
      window.location.assign('/admin/login');
    },
  });

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* Skip to Content Link (WCAG AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-terracotta-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta-400"
      >
        Skip to main content
      </a>

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-cream-100/95 backdrop-blur-md shadow-warm-sm border-b border-espresso-100/80 py-3'
            : 'bg-cream-100 border-b border-espresso-100/50 py-4'
        }`}
      >
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <Link
              to="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 rounded-lg p-1 -ml-1"
              aria-label="Brew & Bloom Café Home"
            >
              <div className="w-10 h-10 rounded-xl bg-espresso-600 text-cream-100 flex items-center justify-center shadow-warm-sm group-hover:bg-terracotta-600 transition-colors">
                <Coffee className="w-5 h-5 text-cream-50" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-espresso-900 leading-tight">
                  Brew & Bloom
                </span>
                <span className="text-[11px] font-medium uppercase tracking-widest text-espresso-500 -mt-0.5">
                  Café · Pune
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-xl text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 ${
                      isActive
                        ? 'text-terracotta-600 font-semibold bg-terracotta-50/80'
                        : 'text-espresso-700 hover:text-espresso-900 hover:bg-espresso-50/60'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Desktop CTA & Mobile Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Shopping Cart Button */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-2 rounded-xl text-espresso-700 hover:text-espresso-950 hover:bg-espresso-50/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500"
                aria-label={`Open order tray with ${totalItems} items`}
              >
                <ShoppingBag className="w-5 h-5 text-espresso-800" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-terracotta-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in-75">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* Customer Account / Sign In */}
              {user ? (
                <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-espresso-200/60">
                  <Link
                    to="/my-orders"
                    className="text-xs font-semibold text-espresso-800 hover:text-terracotta-600 px-2 py-1.5 rounded-lg hover:bg-espresso-50 transition-colors flex items-center gap-1"
                    title="View My Orders"
                  >
                    <span>My Orders</span>
                  </Link>
                  <span className="text-xs font-medium text-espresso-500 max-w-[90px] truncate" title={user.displayName || user.email}>
                    ({user.displayName || user.email?.split('@')[0]})
                  </span>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="p-1.5 text-espresso-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sign Out"
                    aria-label="Sign out of customer account"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:block pl-1 border-l border-espresso-200/60">
                  <Link
                    to="/login"
                    className="text-xs font-bold text-espresso-800 hover:text-terracotta-600 px-2 py-1.5 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              <div className="hidden md:block">
                <Button
                  to="/menu"
                  variant="primary"
                  size="sm"
                  className="font-medium"
                >
                  Order Menu
                </Button>
              </div>

              {/* Mobile Hamburger Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-espresso-700 hover:bg-espresso-100/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-espresso-800" />
                ) : (
                  <MenuIcon className="w-6 h-6 text-espresso-800" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            className="md:hidden bg-cream-50 border-b border-espresso-200/80 px-4 pt-3 pb-6 space-y-3 shadow-warm-md animate-in slide-in-from-top-2 duration-200"
            role="dialog"
            aria-label="Mobile Navigation"
          >
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-terracotta-500 text-white font-semibold'
                        : 'text-espresso-800 hover:bg-espresso-100/70'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Mobile Order & Account Bar */}
            <div className="pt-3 border-t border-espresso-100 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCart();
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-cream-200/80 text-espresso-900 font-bold text-sm"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-terracotta-600" />
                  <span>View Order Tray</span>
                </div>
                <span className="text-xs bg-espresso-800 text-white px-2 py-0.5 rounded-full font-bold">
                  {totalItems}
                </span>
              </button>

              {user ? (
                <div className="flex flex-col gap-1.5 px-3 py-2 bg-white rounded-xl border border-espresso-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-espresso-800 truncate">
                      👤 {user.displayName || user.email}
                    </span>
                    <button
                      type="button"
                      onClick={() => logout()}
                      className="text-red-600 font-bold hover:underline"
                    >
                      Sign Out
                    </button>
                  </div>
                  <Link
                    to="/my-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-terracotta-700 font-semibold pt-1 border-t border-espresso-100 flex items-center justify-between"
                  >
                    <span>View My Orders</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-espresso-200 bg-white text-espresso-800 font-bold text-sm hover:bg-cream-100"
                >
                  Customer Sign In
                </Link>
              )}

              <Button to="/menu" variant="primary" size="md" className="w-full justify-center">
                Explore Full Menu
              </Button>
              <div className="flex items-center justify-around pt-2 text-xs text-espresso-600">
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-1.5 py-1 px-2 hover:text-terracotta-600"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Us
                </a>
                <span className="text-espresso-300">|</span>
                <Link
                  to="/contact"
                  className="flex items-center gap-1.5 py-1 px-2 hover:text-terracotta-600"
                >
                  <MapPin className="w-3.5 h-3.5" /> Koregaon Park
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
