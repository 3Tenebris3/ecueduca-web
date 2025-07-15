import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useCreateReward, useUpdateReward } from "../../features/rewards/hooks";
import type { RewardDTO } from "../../api/rewards/rewards.types";

type FormValues = RewardDTO;

interface Props {
  open: boolean;
  onClose: () => void;
  editing?: RewardDTO | null;
}

export default function RewardDialog({ open, onClose, editing }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: editing ?? {
      id: "",
      name: "",
      description: "",
      threshold: 0,
      image: "",
    },
  });

  const create = useCreateReward();
  const update = useUpdateReward();

  const submit = handleSubmit(async (data) => {
    if (editing) {
      const { id, ...rest } = data;
      await update.mutateAsync({ id, dto: rest });
    } else {
      await create.mutateAsync(data);
    }
    reset();
    onClose();
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editing ? "Editar recompensa" : "Nueva recompensa"}</DialogTitle>
      <form onSubmit={submit}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="ID (único)"
            {...register("id", { required: true })}
            disabled={!!editing}
            error={!!errors.id}
          />
          <TextField
            label="Nombre"
            {...register("name", { required: true })}
            error={!!errors.name}
          />
          <TextField
            label="Descripción"
            {...register("description")}
          />
          <TextField
            label="Puntos requeridos"
            type="number"
            {...register("threshold", { required: true, min: 1 })}
            error={!!errors.threshold}
          />
          <TextField
            label="URL de imagen (opcional)"
            {...register("image")}
          />
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={create.isPending || update.isPending}>
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
