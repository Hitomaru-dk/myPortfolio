import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { GithubIcon, InstagramIcon, FacebookIcon } from '../components/BrandIcons';
import LangToggle from '../components/LangToggle';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { key: 'home', path: '/' },
  { key: 'projects', path: '/projects' },
  { key: 'about', path: '/about' },
] as const;

export default function MainLayout() {
  const { t } = useTranslation();
  const { isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md border-b border-hairline">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo / site name */}
          <NavLink
            to="/"
            className="font-display font-bold text-lg tracking-widest text-text hover:text-accent-blue transition-colors uppercase"
          >
            PORT<span className="text-accent-gold">FOLIO</span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.key}
                  to={link.path}
                  className={`target-bracket relative font-display text-sm tracking-wider uppercase px-4 py-2 transition-colors duration-200 ${
                    isActive
                      ? 'text-accent-blue active'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {t(`nav.${link.key}`)}
                </NavLink>
              );
            })}
          </nav>

          {/* Right side: lang toggle + admin logout + mobile menu */}
          <div className="flex items-center gap-3">
            <LangToggle />

            {isAdmin && (
              <button
                onClick={logout}
                className="hidden md:block font-mono text-[10px] tracking-wider text-accent-red border border-accent-red/30 bg-accent-red/5 px-2.5 py-1.5 hover:bg-accent-red hover:text-white transition-all duration-200 cursor-pointer uppercase font-semibold"
              >
                {t('login.logout')}
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-text-muted hover:text-text transition-colors cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <div className="relative w-[22px] h-[22px]">
                <X
                  size={22}
                  className={`absolute inset-0 transition-all duration-300 ${
                    mobileOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
                  }`}
                />
                <Menu
                  size={22}
                  className={`absolute inset-0 transition-all duration-300 ${
                    mobileOpen ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile nav drawer — CSS transition instead of conditional render */}
        <nav
          className={`md:hidden bg-surface border-t border-hairline mobile-nav ${
            mobileOpen ? 'open' : ''
          }`}
          aria-label="Mobile navigation"
          aria-hidden={!mobileOpen}
        >
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link, i) => {
              const isActive = location.pathname === link.path;
              return (
                <NavLink
                  key={link.key}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`font-display text-sm tracking-wider uppercase px-3 py-2.5 transition-all duration-300 ${
                    isActive ? 'text-accent-blue' : 'text-text-muted hover:text-text'
                  }`}
                  style={{
                    transitionDelay: mobileOpen ? `${i * 60}ms` : '0ms',
                    opacity: mobileOpen ? 1 : 0,
                    transform: mobileOpen ? 'translateX(0)' : 'translateX(-12px)',
                  }}
                  tabIndex={mobileOpen ? 0 : -1}
                >
                  {t(`nav.${link.key}`)}
                </NavLink>
              );
            })}
            {isAdmin && (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-left font-mono text-xs text-accent-red/70 hover:text-accent-red transition-colors px-3 py-2.5 cursor-pointer uppercase tracking-wider"
                tabIndex={mobileOpen ? 0 : -1}
              >
                {t('login.logout')}
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* ===== Main content ===== */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ===== Footer ===== */}
      <footer className="border-t border-hairline">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-text-muted tracking-wide">
            {t('footer.copyright')}
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-blue social-bounce"
              aria-label="GitHub"
            >
              <GithubIcon style={{ width: 18, height: 18 }} />
            </a>
            <a
              href="https://line.me"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-blue social-bounce"
              aria-label="Line"
            >
              <MessageCircle size={18} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-blue social-bounce"
              aria-label="Instagram"
            >
              <InstagramIcon style={{ width: 18, height: 18 }} />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-blue social-bounce"
              aria-label="Facebook"
            >
              <FacebookIcon style={{ width: 18, height: 18 }} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
