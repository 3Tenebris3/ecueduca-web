import { Link as RouterLink } from "react-router-dom";
import { Box, Card, CardActionArea, Divider, Typography } from "@mui/material";

import QuizIcon              from "@mui/icons-material/Quiz";
import BlurCircularIcon      from "@mui/icons-material/BlurCircular";        // Memory
import FindInPageIcon        from "@mui/icons-material/FindInPage";          // Quick-Pick
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered"; // Sequence
import TextFieldsIcon        from "@mui/icons-material/TextFields";          // Fill-Blank
import type { JSX } from "react";

/* ───────────── tarjetas que mostramos ───────────── */
type GameCard = {
  id:    string;
  label: string;
  sub:   string;
  to:    string;
  color: string;
  icon:  JSX.Element;
};

const cards: GameCard[] = [
  {
    id: "memory",
    label: "Memoria",
    sub: "Parejas de imagen/título",
    to: "/dashboard/minigames/memory",
    color: "#06b6d4",
    icon: <BlurCircularIcon sx={{ fontSize: 46 }} />,
  },
  {
    id: "trivia",
    label: "Trivia",
    sub: "Preguntas de opción múltiple",
    to: "/dashboard/minigames/trivia",
    color: "#f59e0b",
    icon: <QuizIcon sx={{ fontSize: 46 }} />,
  },
  {
    id: "quickpick",
    label: "Escoge-rápido",
    sub: "Encuentra el objeto",
    to: "/dashboard/minigames/quickpick",
    color: "#4caf50",
    icon: <FindInPageIcon sx={{ fontSize: 46 }} />,
  },
  {
    id: "fillblank",
    label: "Completa el espacio",
    sub: "Texto con huecos",
    to: "/dashboard/minigames/fillblank",
    color: "#8b5cf6",
    icon: <TextFieldsIcon sx={{ fontSize: 46 }} />,
  },
  {
    id: "sequence",
    label: "Secuencias",
    sub: "Ordena los ítems",
    to: "/dashboard/minigames/sequence",
    color: "#ef4444",
    icon: <FormatListNumberedIcon sx={{ fontSize: 46 }} />,
  },
];

export default function MinigamesHub() {
  return (
    <Box>
      {/* Título bonito --igual que en HomeDashboard */}
      <Typography
        variant="h4"
        fontWeight={700}
        sx={{
          mb: 4,
          background: "linear-gradient(90deg,#6366f1,#ec4899)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Minijuegos
      </Typography>

      {/* Cuadrícula responsiva */}
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {cards.map((c) => (
          <Card key={c.id} sx={{ p: 3 }}>
            <CardActionArea
              component={RouterLink}
              to={c.to}
              sx={{ textAlign: "center", py: 4 }}
            >
              <Box sx={{ color: c.color, mb: 2 }}>{c.icon}</Box>
              <Typography variant="h6" fontWeight={600}>
                {c.label}
              </Typography>
              <Divider sx={{ my: 1, width: 60, mx: "auto" }} />
              <Typography variant="body2" color="text.secondary">
                {c.sub}
              </Typography>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
