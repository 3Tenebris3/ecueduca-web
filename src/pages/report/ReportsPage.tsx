import { useState, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Autocomplete,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import {
  LocalizationProvider,
} from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { listUsers } from "../../api/users/users.api";
import type { UserDTO } from "../../api/users/users.types";

/* ------------------------------------------------------------------
   Mock helpers
   ------------------------------------------------------------------ */
const SCENARIOS = [
  "Bosque lluvioso",
  "Desierto cálido",
  "Ártico",
  "Montaña nevada",
];
const MINIGAMES = ["Trivia", "Quiz", "Memorama", "Puzzle 3D"];

interface StatsResponse {
  accesses: number;
  attempts: number;
  avgScore: number; // 0-100
  scoreByMinigame: { minigame: string; score: number }[];
  scoreTimeline: { date: string; score: number }[];
  attemptsByScenario: { scenario: string; attempts: number }[];
}

/* ------------------------------------------------------------------
   MOCK hook – sustituye por tu llamada real
   ------------------------------------------------------------------ */
function useStudentStats(
  studentId: string | null,
  scenario: string | "",
  minigame: string | "",
  dateFrom: Dayjs | null,
  dateTo: Dayjs | null
) {
  return useQuery<StatsResponse>({
    queryKey: [
      "stats",
      studentId,
      scenario,
      minigame,
      dateFrom?.format("YYYY-MM-DD"),
      dateTo?.format("YYYY-MM-DD"),
    ],
    enabled: !!studentId,
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      const rand = (min: number, max: number) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

      const accesses = rand(20, 120);
      const attempts = rand(5, 50);
      const avgScore = rand(50, 100);

      const scoreByMinigame = MINIGAMES.map((m) => ({
        minigame: m,
        score: rand(50, 100),
      }));

      const scoreTimeline = Array.from({ length: 10 })
        .map((_, i) => ({
          date: dayjs().subtract(i, "day").format("YYYY-MM-DD"),
          score: rand(40, 100),
        }))
        .reverse();

      const attemptsByScenario = SCENARIOS.map((s) => ({
        scenario: s,
        attempts: rand(1, 15),
      }));

      return {
        accesses,
        attempts,
        avgScore,
        scoreByMinigame,
        scoreTimeline,
        attemptsByScenario,
      };
    },
  });
}

/* ------------------------------------------------------------------ */

const KPI: React.FC<{ title: string; value: number | string }> = ({
  title,
  value,
}) => (
  <Card elevation={3} sx={{ height: "100%" }}>
    <CardContent>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

export default function ReportsPage() {
  /* ---------- users ---------- */
  const { data: users = [] } = useQuery<UserDTO[]>({
    queryKey: ["users", "students-only"],
    queryFn: async () => {
      const all = await listUsers();
      return all.filter((u) => u.role === "student");
    },
  });

  /* ---------- filters ---------- */
  const [selectedStudent, setSelectedStudent] = useState<UserDTO | null>(null);
  const [scenario, setScenario] = useState<string | "">("");
  const [minigame, setMinigame] = useState<string | "">("");
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);

  /* ---------- stats ---------- */
  const { data: stats } = useStudentStats(
    selectedStudent?.id ?? null,
    scenario,
    minigame,
    dateFrom,
    dateTo
  );

  const kpiList = useMemo(
    () => [
      { title: "Accesos", value: stats?.accesses ?? "―" },
      { title: "Intentos", value: stats?.attempts ?? "―" },
      { title: "Promedio", value: stats ? `${stats.avgScore}%` : "―" },
    ],
    [stats]
  );

  /* ---------- render ---------- */
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight={700} mb={3}>
          Reportes de Estudiantes
        </Typography>

        {/* ---------- Filtros ---------- */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="center"
          mb={4}
        >
          <Autocomplete
            sx={{ minWidth: 260 }}
            options={users}
            getOptionLabel={(o) => o.displayName}
            value={selectedStudent}
            onChange={(_, v) => setSelectedStudent(v)}
            renderInput={(params) => (
              <TextField {...params} label="Selecciona estudiante" />
            )}
          />

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="scenario-label">Escenario</InputLabel>
            <Select
              labelId="scenario-label"
              value={scenario}
              label="Escenario"
              onChange={(e) => setScenario(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {SCENARIOS.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel id="minigame-label">Minijuego</InputLabel>
            <Select
              labelId="minigame-label"
              value={minigame}
              label="Minijuego"
              onChange={(e) => setMinigame(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {MINIGAMES.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <DatePicker
            label="Desde"
            value={dateFrom}
            onChange={(v) => setDateFrom(v)}
            slotProps={{ textField: { sx: { minWidth: 140 } } }}
          />
          <DatePicker
            label="Hasta"
            value={dateTo}
            onChange={(v) => setDateTo(v)}
            slotProps={{ textField: { sx: { minWidth: 140 } } }}
          />
        </Stack>

        {/* ---------- KPIs ---------- */}
        <Grid container spacing={2} mb={4}>
          {kpiList.map((k) => (
            <div key={k.title}>
              <KPI {...k} />
            </div>
          ))}
        </Grid>

        {/* ---------- Charts ---------- */}
        {stats && (
          <Grid container spacing={3}>
            {/* Score timeline */}
            <div>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Evolución del puntaje
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={stats.scoreTimeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#1976d2"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Score by minigame */}
            <div>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Puntaje por minijuego
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={stats.scoreByMinigame}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="minigame" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#1976d2" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Attempts by scenario */}
            <div>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Intentos por escenario
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.attemptsByScenario} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis
                        type="category"
                        dataKey="scenario"
                        tick={{ fontSize: 12 }}
                        width={150}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="attempts" fill="#ef6c00" barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </Grid>
        )}

        {!selectedStudent && (
          <Typography color="text.secondary" mt={4} align="center">
            Selecciona un estudiante para ver los reportes.
          </Typography>
        )}
      </Box>
    </LocalizationProvider>
  );
}