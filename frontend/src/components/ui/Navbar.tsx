// src/components/ui/Navbar.tsx

import { useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState, useRef, useEffect } from "react";
import { Button } from "./button";

type LocalUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

// Helper to read auth state from localStorage
const getAuthState = () => {
  const token = localStorage.getItem("token");
  const stored = localStorage.getItem("user");
  const user: LocalUser | null = stored ? JSON.parse(stored) : null;
  return { isLoggedIn: Boolean(token), user };
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [auth, setAuth] = useState(getAuthState);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDashboard = useMemo(
    () => location.pathname.startsWith("/dashboard"),
    [location.pathname]
  );

  // 👇 Listen for auth changes (login/logout) and re-read localStorage
  useEffect(() => {
    const handleAuthChange = () => setAuth(getAuthState());
    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = useMemo(() => {
    const { user } = auth;
    if (user?.firstName && user?.lastName)
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    if (user?.firstName) return user.firstName[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return "U";
  }, [auth]);

  const fullName = useMemo(() => {
    const { user } = auth;
    if (user?.firstName && user?.lastName)
      return `${user.firstName} ${user.lastName}`;
    if (user?.firstName) return user.firstName;
    return "User";
  }, [auth]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // 👇 Notify Navbar to re-render
    window.dispatchEvent(new Event("authChange"));
    setIsLogoutDialogOpen(false);
    setIsProfileDropdownOpen(false);
    navigate("/");
    window.location.reload(); // 👈 Add this line

  };

  return (
    <>
      <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">

          {/* Logo */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="truncate text-lg font-bold tracking-tight text-slate-900 transition-colors hover:text-violet-600 sm:text-xl"
          >
            Namaco
          </button>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {auth.isLoggedIn ? (
              <>
                {/* <Button
                  variant="ghost"
                  className="hidden px-3 sm:inline-flex sm:px-4"
                  onClick={() => navigate("/")}
                >
                  Home
                </Button> */}
                {!isDashboard && (
                  <Button
                    variant="ghost"
                    className="hidden px-3 sm:inline-flex sm:px-4"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Button>
                )}

                {/* Profile Avatar Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfileDropdownOpen((p) => !p)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white shadow-md ring-2 ring-violet-200 transition-all duration-200 hover:bg-violet-500 hover:ring-violet-400 focus:outline-none"
                    aria-label="Profile menu"
                  >
                    {initials}
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
                      {/* User info */}
                      <div className="border-b border-slate-100 px-4 pb-3 pt-1">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {fullName}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {auth.user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="px-2 py-1">
                        {/* Home */}
                        {/* <button
                          type="button"
                          onClick={() => { setIsProfileDropdownOpen(false); navigate("/"); }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Home
                        </button> */}

                        {/* Dashboard */}
                        <button
                          type="button"
                          onClick={() => { setIsProfileDropdownOpen(false); navigate("/dashboard"); }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                        >
                          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                          Dashboard
                        </button>

                        {/* Edit Profile - Coming Soon */}
                        <button
                          type="button"
                          disabled
                          className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400"
                        >
                          <svg className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Edit Profile
                          <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-400">
                            Soon
                          </span>
                        </button>

                        <div className="my-1 border-t border-slate-100" />

                        {/* Logout */}
                        <button
                          type="button"
                          onClick={() => { setIsProfileDropdownOpen(false); setIsLogoutDialogOpen(true); }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* <Button variant="ghost" className="px-3 sm:px-4" onClick={() => navigate("/")}>
                  Home
                </Button> */}
                <Button variant="ghost" className="px-3 sm:px-4" onClick={() => navigate("/signup")}>
                  Sign Up
                </Button>
                <Button className="px-3 sm:px-4" onClick={() => navigate("/signin")}>
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Dialog */}
      {isLogoutDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Confirm Logout</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to log out from your account?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleLogout}>
                Yes, Log Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}