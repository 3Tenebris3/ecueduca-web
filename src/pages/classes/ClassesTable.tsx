import { useState } from "react";
import { Box, Button, Chip, Typography } from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";

import { useClasses, useDeleteClass } from "../../features/classes/hooks";
import { useTeachers } from "../../features/users/hooks";

import ClassDialog from "./ClassDialog";
import EnrollDialog from "./EnrollDialog";
import type { ClassDTO } from "../../api/classes/classes.types";

export default function ClassesTable() {
  const { data: rows = [] } = useClasses();
  const { data: teachers = [] } = useTeachers();
  const delClass = useDeleteClass();

  const [dlg, setDlg] = useState<
    | { type: "crud"; classItem: ClassDTO | null }
    | { type: "enroll"; classItem: ClassDTO }
    | null
  >(null);

  const cols: GridColDef[] = [
    { field: "name", headerName: "Nombre", flex: 1 },
    { field: "grade", headerName: "Grado", width: 140 },
    {
      field: 'teacherId',
      headerName: 'Profesor',
      flex: 1,
      renderCell: ({ value }) => {
        const prof = teachers.find(t => t.id === value);
        return prof ? prof.displayName : '—';
      }
    },
    {
      field: "studentsCount",
      headerName: "Estudiantes",
      width: 150,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          size="small"
          color={value > 0 ? "primary" : "default"}
        />
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
          label="edit"
          onClick={() => setDlg({ type: "crud", classItem: row })}
        />,
        <GridActionsCellItem
          key="del"
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => delClass.mutate(row.id)}
          showInMenu
        />,
        <GridActionsCellItem
          key="enroll"
          icon={<PeopleIcon />}
          label="Agregar Estudiantes"
          onClick={() => setDlg({ type: "enroll", classItem: row })}
          showInMenu
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 560 }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" fontWeight={600}>
          Clases
        </Typography>
        <Button
          variant="contained"
          onClick={() => setDlg({ type: "crud", classItem: null })}
        >
          Nueva
        </Button>
      </Box>

      <DataGrid
        rows={rows}
        columns={cols}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 25]}
      />

      {/* CRUD */}
      {dlg?.type === "crud" && (
        <ClassDialog
          open
          onClose={() => setDlg(null)}
          editing={dlg.classItem ?? undefined}
        />
      )}

      {/* Matricular */}
      {dlg?.type === "enroll" && (
        <EnrollDialog
          open
          onClose={() => setDlg(null)}
          classId={dlg.classItem.id}
        />
      )}
    </Box>
  );
}
