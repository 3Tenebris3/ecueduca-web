import { useState } from "react";
import { Box, Button, Typography, Chip } from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QuestionMarkIcon from "@mui/icons-material/Quiz";

import { useQuizSets, useDeleteSet } from "../../features/quizzes/hooks";
import SetDialog from "./SetDialog";
import QuestionsDrawer from "./QuestionsDrawer";
import type { QuizSetDTO } from "../../api/quizzes/quizzes.types";

export default function QuizzesTable() {
  const { data: rows = [] } = useQuizSets();
  const del = useDeleteSet();

  const [dlg, setDlg] = useState<
    | { type: "crud"; item: QuizSetDTO | null }
    | { type: "qs"; item: QuizSetDTO }
    | null
  >(null);

  const cols: GridColDef[] = [
    { field: "title", headerName: "Título", flex: 1 },
    {
      field: "total",
      headerName: "Preguntas.",
      width: 150,
      renderCell: ({ value }) => (
        <Chip label={value} size="small" color="primary" />
      ),
    },
    {
      field: "actions",
      type: "actions",
      width: 120,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Modificar"
          onClick={() => setDlg({ type: "crud", item: row })}
        />,
        <GridActionsCellItem
          key="qs"
          icon={<QuestionMarkIcon />}
          label="Preguntas"
          onClick={() => setDlg({ type: "qs", item: row })}
        />,
        <GridActionsCellItem
          key="del"
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => del.mutate(row.id)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 560 }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" fontWeight={600}>
          Cuestionarios
        </Typography>
        <Button
          variant="contained"
          onClick={() => setDlg({ type: "crud", item: null })}
        >
          Nuevo
        </Button>
      </Box>

      <DataGrid rows={rows} columns={cols} disableRowSelectionOnClick />

      {/* Crear / Editar */}
      {dlg?.type === "crud" && (
        <SetDialog
          open
          onClose={() => setDlg(null)}
          editing={dlg.item ?? undefined}
        />
      )}

      {/* Editor preguntas */}
      {dlg?.type === "qs" && (
        <QuestionsDrawer open onClose={() => setDlg(null)} quiz={dlg.item} />
      )}
    </Box>
  );
}
