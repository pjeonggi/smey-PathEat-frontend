// Auth context — single source for session state across all domains.
// Swap login/signup bodies for real Axios calls; nothing else changes.

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const MOCK_USERS = [
  {
    id: "u-001",
    firstName: "Sophea",
    lastName: "Meng",
    email: "sophea@patheat.app",
    phone: "012-345-678",
    role_scope: "CONSUMER",
  },
  {
    id: "u-002",
    firstName: "Dara",
    lastName: "Vuth",
    email: "dara@patheat.app",
    phone: "098-765-432",
    role_scope: "CONSUMER",
  },
];

const SESSION_KEY = "patheat_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  async function login(email, _password) {
    // TODO: POST /api/auth/login
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
    if (!found) throw new Error("No account found with that email.");
    setUser(found);
  }

  async function signup({ firstName, lastName, email }) {
    // TODO: POST /api/auth/register
    const newUser = {
      id: `u-${Date.now()}`,
      firstName,
      lastName,
      email,
      phone: "",
      role_scope: "CONSUMER",
    };
    MOCK_USERS.push(newUser);
    setUser(newUser);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
