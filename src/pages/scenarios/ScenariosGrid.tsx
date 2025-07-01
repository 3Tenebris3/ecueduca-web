// src/pages/scenarios/ScenariosGrid.tsx
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Badge,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useScenes, useDeleteScene } from '../../features/scenarios/hooks';
import SceneDialog from './SceneDialog';
import { useState } from 'react';
import type { SceneMetaDTO } from '../../api/scenarios/scenarios.types';

export default function ScenariosGrid() {
  const { data: scenes = [] } = useScenes();
  const del = useDeleteScene();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SceneMetaDTO | null>(null);

  return (
    <>
      {/* encabezado */}
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Escenarios 3D
        </Typography>

        <Tooltip title="Nuevo escenario">
          <IconButton
            color="primary"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* galería responsiva */}
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
          }
        }}
      >
        {scenes.map((s) => (
          <Badge
            key={s.id}
            color="success"
            overlap="rectangular"
            badgeContent={<CheckCircleIcon />}
            invisible={!s.completed}
          >
            <Card>
              <CardActionArea
                onClick={() => {
                  setEditing(s);
                  setOpen(true);
                }}
              >
                <Box
                  component="img"
                  src={s.preview}
                  alt={s.title}
                  sx={{ width: '100%', height: 140, objectFit: 'cover' }}
                />
                <CardContent sx={{ pb: '8px!important' }}>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>
                    {s.title}
                  </Typography>
                </CardContent>
              </CardActionArea>

              {/* acciones rápidas */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 1, pb: 1 }}>
                <IconButton size="small" onClick={() => del.mutate(s.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          </Badge>
        ))}
      </Box>

      {/* diálogo crear / editar */}
      {open && (
        <SceneDialog
          open={open}
          editing={editing ?? undefined}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
