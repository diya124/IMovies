import React, { useState } from 'react';
import {
  Film,
  User as UserIcon,
  LogOut,
  Ticket,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onSearchClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const navItems = [
    { label: 'Home', tab: 'home' },
    { label: 'Movies', tab: 'movies' },
    { label: 'Upcoming', tab: 'upcoming' },
    { label: 'Cinemas', tab: 'theatres' },
  ];

  const navClass = (tab: string) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition ${
      currentTab === tab
        ? 'bg-red-600/15 text-white'
        : 'text-neutral-400 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090b]/95 text-white shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate('home')}
          aria-label="IMovies home"
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-800 shadow-lg shadow-red-950/50">
            <Film className="h-5 w-5 text-white" />
          </span>

          <span className="text-xl font-black tracking-tight sm:text-2xl">
            <span className="text-red-500">I</span>MOVIES
            <span className="ml-1 hidden text-[9px] font-bold tracking-[0.2em] text-[#c9a45c] sm:inline">
              CINEMA
            </span>
          </span>
        </button>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {navItems.map((item) => (
            <button
              type="button"
              key={item.tab}
              onClick={() => navigate(item.tab)}
              aria-current={currentTab === item.tab ? 'page' : undefined}
              className={navClass(item.tab)}
            >
              {item.label}
            </button>
          ))}

          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate('admin')}
              className={`ml-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                currentTab === 'admin'
                  ? 'bg-amber-400/10 text-[#e5c477]'
                  : 'text-[#c9a45c] hover:bg-amber-400/10'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </button>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
                aria-expanded={dropdownOpen}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-2 transition hover:border-[#c9a45c]/50 sm:px-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/20 text-sm font-bold text-red-300">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>

                <span className="hidden max-w-[100px] truncate text-sm font-semibold sm:inline">
                  {user.name?.split(' ')[0] || 'Account'}
                </span>

                <ChevronDown className="h-4 w-4 text-neutral-400" />
              </button>

              {dropdownOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close account menu"
                    className="fixed inset-0 z-30 cursor-default"
                    onClick={() => setDropdownOpen(false)}
                  />

                  <div className="absolute right-0 z-40 mt-3 w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#151518] py-2 shadow-2xl shadow-black/60">
                    <div className="border-b border-white/10 px-4 py-3">
                      <p className="truncate font-bold">{user.name}</p>
                      <p className="mt-1 truncate text-xs text-neutral-400">
                        {user.email}
                      </p>

                      {isAdmin && (
                        <span className="mt-2 inline-block rounded-full bg-amber-400/10 px-2 py-1 text-[10px] font-bold uppercase text-[#c9a45c]">
                          Administrator
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate('dashboard')}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-neutral-300 transition hover:bg-white/5 hover:text-white"
                    >
                      <Ticket className="h-4 w-4 text-[#c9a45c]" />
                      My Bookings
                    </button>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => navigate('admin')}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#c9a45c] hover:bg-white/5"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        Admin Console
                      </button>
                    )}

                    <div className="my-1 border-t border-white/10" />

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-neutral-300 transition hover:text-white sm:inline-flex"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="rounded-lg bg-red-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-950/40 transition hover:bg-red-500 sm:px-4 sm:text-sm"
              >
                Get Tickets
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10 md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-white/10 bg-[#0d0d10] px-4 py-3 md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.tab}
                onClick={() => navigate(item.tab)}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  currentTab === item.tab
                    ? 'bg-red-600/15 text-white'
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.label}
                {currentTab === item.tab && (
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                )}
              </button>
            ))}

            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate('admin')}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#c9a45c] hover:bg-white/5"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Console
              </button>
            )}

            {isAuthenticated && (
              <button
                type="button"
                onClick={() => navigate('dashboard')}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-semibold text-neutral-300 hover:bg-white/5"
              >
                <UserIcon className="h-4 w-4" />
                My Bookings
              </button>
            )}

            {!isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="mt-2 rounded-xl border border-white/10 px-4 py-3 text-left text-sm font-semibold text-neutral-200"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};