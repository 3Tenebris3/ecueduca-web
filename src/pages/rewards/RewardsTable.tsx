import {
  Box,
  Button,
  Typography
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  GridActionsCellItem
} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useRewards, useDeleteReward } from "../../features/rewards/hooks";
import type { RewardDTO } from "../../api/rewards/rewards.types";
import RewardDialog from "./RewardDialog";

export default function RewardsTable() {
  const { data: rewards = [] } = useRewards();
  const delReward = useDeleteReward();
  const [editing, setEdit] = useState<RewardDTO | null>(null);
  const [open, setOpen] = useState(false);

  const cols: GridColDef[] = [
    { field: "name", headerName: "Nombre", flex: 1 },
    { field: "threshold", headerName: "Puntos", width: 100 },
    { field: "description", headerName: "Descripción", flex: 2 },
    {
      field: "actions",
      type: "actions",
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => {
            setEdit(row);
            setOpen(true);
          }}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => delReward.mutate(row.id)}
          showInMenu
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 560 }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h5" fontWeight={600}>
          Recompensas
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setEdit(null);
            setOpen(true);
          }}
        >
          Nueva
        </Button>
      </Box>

      <DataGrid
        rows={rewards}
        columns={cols}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
      />

      {open && (
        <RewardDialog
          open={open}
          onClose={() => setOpen(false)}
          editing={editing}
        />
      )}
    </Box>
  );
}
