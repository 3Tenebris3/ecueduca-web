import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../core/auth";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";

import HomeIcon from "@mui/icons-material/Home";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box } from "@mui/material";

export default function DashboardLayout() {
  const { state, logout } = useAuth();
  const nav = useNavigate();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const close = () => setAnchor(null);

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#31393C", // color de fondo personalizado
          borderBottom: "1px solid #e5e7eb", // gris claro
          color: "#1f2937", // texto gris oscuro
        }}
      >
        <Toolbar sx={{ px: 3 }}>
          {/* Logo + nombre */}
          <Link
            to="/dashboard/home"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <img
              src="/logo.png"
              alt="logo"
              width={32}
              height={32}
              style={{ marginRight: 10 }}
            />
            <Typography variant="h6" fontWeight={700} color="#fff">
              EcuEduca
            </Typography>
          </Link>

          {/* Espaciador */}
          <div style={{ flexGrow: 1 }} />

          {/* Nombre de usuario + rol */}
          {state.user && (
            <Box sx={{ textAlign: "right", mr: 2 }}>
              <Typography variant="body1" fontWeight={600} color="#fff">
                {state.user.displayName}
              </Typography>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Rol:{" "}
                {state.user.role === "admin" ? "Administrador" : "Profesor"}
              </Typography>
            </Box>
          )}

          <Tooltip title="Inicio">
            <IconButton
              component={Link}
              to="/dashboard/home"
              sx={{ ml: 3, color: "#fff" }}
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>

          {/* Menú de usuario */}
          <IconButton
            color="inherit"
            onClick={(e) => setAnchor(e.currentTarget)}
            sx={{ color: "#fff" }}
          >
            <AccountCircle fontSize="large" />
          </IconButton>

          <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={close}>
            <MenuItem
              onClick={() => {
                close();
                logout();
                nav("/login");
              }}
            >
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* CONTENIDO */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}
