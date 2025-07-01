import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from "react";
import { Snackbar, Alert } from "@mui/material";
import type { AlertColor } from "@mui/material";

type Role = "admin" | "teacher" | "student" | "parent";

interface User {
  id: string;
  displayName: string;
  email: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

interface Toast {
  title: string;
  description?: string;
  severity?: AlertColor;
}

const AuthCtx = createContext(
  {} as {
    state: AuthState;
    login: (u: User, t: string) => void;
    logout: () => void;
    notify: (toast: Toast) => void;
  }
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const rawUser = localStorage.getItem("user");
  const parsed =
    rawUser && rawUser !== "undefined" ? JSON.parse(rawUser) : null;

  const [state, set] = useState<AuthState>({
    user: parsed,
    token: localStorage.getItem("token") || null,
  });

  const login = (user: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    set({ user, token });
  };

  const logout = () => {
    localStorage.clear();
    set({ user: null, token: null });
  };

  // Estado y lógica para Toasts
  const [toast, setToast] = useState<Toast | null>(null);
  const [open, setOpen] = useState(false);

  const notify = useCallback((toast: Toast) => {
    setToast(toast);
    setOpen(true);
  }, []);

  const handleClose = () => setOpen(false);

  function bgColor(severity: AlertColor): string {
    switch (severity) {
      case "success":
        return "#22c55e"; // verde
      case "error":
        return "#ef4444"; // rojo
      case "warning":
        return "#f59e0b"; // naranja
      case "info":
      default:
        return "#3b82f6"; // azul
    }
  }

  return (
    <AuthCtx.Provider value={{ state, login, logout, notify }}>
      {children}

      {/* Render del Snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{
          mb: 3,
          mr: 3,
        }}
      >
        {toast ? (
          <Alert
            onClose={handleClose}
            severity={toast.severity || "info"}
            variant="filled"
            icon={false}
            sx={{
              width: "100%",
              px: 2,
              py: 1.5,
              borderRadius: 2,
              boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
              fontSize: "0.95rem",
              fontWeight: 500,
              color: "#000",
              alignItems: "flex-start",
              backgroundColor: bgColor(toast.severity || "info"),
            }}
          >
            {toast.title}
            {toast.description && ` — ${toast.description}`}
          </Alert>
        ) : undefined}
      </Snackbar>
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
