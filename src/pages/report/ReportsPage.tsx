import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Autocomplete,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useQuery } from "@tanstack/react-query";
import { listUsers } from "../../api/users/users.api";
import type { UserDTO } from "../../api/users/users.types";

import {
  useStudentScores,
  useStudentScenes,
} from "../../features/reports/hooks";

export default function ReportsPage() {
  /* ─── estudiantes ─────────────────────────── */
  const { data: users = [] } = useQuery<UserDTO[]>({
    queryKey: ["users", "students-only"],
    queryFn: async () => {
      const all = await listUsers();
      return all.filter((u) => u.role === "student");
    },
  });
  const [student, setStudent] = useState<UserDTO | null>(null);

  /* ─── datos ───────────────────────────────── */
  const { data: scores = [], isFetching: fetchingScores } =
    useStudentScores(student?.id ?? null);

  const { data: scenesStats = [], isFetching: fetchingScenes } =
    useStudentScenes(student?.id ?? null);

  /* ─── columnas ────────────────────────────── */
  const quizCols: GridColDef[] = [
    { field: "quizName", headerName: "Cuestionario", flex: 1 },
    {
      field: "score",
      headerName: "Nota",
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "date",
      headerName: "Fecha",
      width: 180,
      valueFormatter: (p: { value: string }) =>
        new Date(p.value).toLocaleDateString("es-ES"),
    },
  ];

  const sceneCols: GridColDef[] = [
    { field: "sceneName", headerName: "Escenario", flex: 1 },
    {
      field: "minutes",
      headerName: "Minutos",
      width: 110,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "progress",
      headerName: "Progreso (%)",
      width: 130,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "lastVisit",
      headerName: "Última visita",
      width: 180,
      valueFormatter: (p: { value: string }) =>
        new Date(p.value).toLocaleDateString("es-ES"),
    },
  ];

  /* ─── KPIs ────────────────────────────────── */
  const avgQuiz = useMemo(() => {
    if (!scores.length) return 0;
    return (
      scores.reduce((acc, s) => acc + s.score, 0) / scores.length
    ).toFixed(1);
  }, [scores]);

  const avgProgress = useMemo(() => {
    if (!scenesStats.length) return 0;
    return (
      scenesStats.reduce((acc, s) => acc + s.progress, 0) /
      scenesStats.length
    ).toFixed(1);
  }, [scenesStats]);

  /* ─── render ──────────────────────────────── */
  return (
    <Box sx={{ px: 2, py: 1 }}>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Reportes
      </Typography>

      <Autocomplete
        sx={{ mb: 3, minWidth: 260 }}
        options={users}
        getOptionLabel={(o) => o.displayName}
        value={student}
        onChange={(_, v) => setStudent(v)}
        renderInput={(p) => <TextField {...p} label="Selecciona estudiante" />}
      />

      {!!student && (
        <>
          {/* ──────── QUIZZES ──────── */}
          <Paper
            elevation={1}
            sx={{ height: 380, mb: 4, borderRadius: 3, overflow: "hidden" }}
          >
            <DataGrid
              rows={scores}
              columns={quizCols}
              getRowId={(r) => r.quizId}
              loading={fetchingScores}
              disableRowSelectionOnClick
            />
          </Paper>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "240px 1fr" },
              gap: 3,
              mb: 5,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6">Promedio quizzes</Typography>
              <Typography variant="h2" fontWeight={700} color="primary">
                {avgQuiz}
              </Typography>
            </Paper>

            <Paper elevation={1} sx={{ p: 2, borderRadius: 3 }}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={scores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quizName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* ──────── ESCENARIOS ──────── */}
          <Typography variant="h5" fontWeight={600} mb={2}>
            Escenarios
          </Typography>

          <Paper
            elevation={1}
            sx={{ height: 360, mb: 3, borderRadius: 3, overflow: "hidden" }}
          >
            <DataGrid
              rows={scenesStats}
              columns={sceneCols}
              getRowId={(r) => r.sceneId}
              loading={fetchingScenes}
              disableRowSelectionOnClick
            />
          </Paper>

          <Paper
            elevation={1}
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
              maxWidth: 320,
            }}
          >
            <Typography variant="h6">Promedio progreso</Typography>
            <Typography variant="h2" fontWeight={700} color="primary">
              {avgProgress}%
            </Typography>
          </Paper>
        </>
      )}
    </Box>
  );
}
