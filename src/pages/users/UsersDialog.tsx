import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useCreateUser, useUpdateUser } from "../../features/users/hooks";
import type { UserDTO, CreateUserDTO } from "../../api/users/users.types";
import type { UpdateUserDTO } from "../../api/users/users.types";

type FormValues = Omit<CreateUserDTO, "password" | "isActive"> & { password?: string; isActive: string };

interface Props {
  open: boolean;
  onClose: () => void;
  editing?: UserDTO | null;
}

export default function UsersDialog({ open, onClose, editing }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: editing
      ? { ...editing, isActive: editing.isActive ? "true" : "false" } // Convert isActive to string
      : { displayName: "", email: "", password: "", role: "student", isActive: "true" },
  });

  const create = useCreateUser();
  const update = useUpdateUser();

  const submit = handleSubmit(async (data) => {
    const formattedData = {
      ...data,
      isActive: data.isActive === "true", // Convert string to boolean
    };
    if (editing) {
      const { ...rest } = formattedData; // evita enviar campo vacío
      await update.mutateAsync({ id: editing.id, dto: rest as UpdateUserDTO });
    } else {
      await create.mutateAsync(formattedData as CreateUserDTO);
    }
    reset();
    onClose();
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editing ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>

      <form onSubmit={submit}>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Nombre"
            {...register("displayName", { required: true })}
            error={!!errors.displayName}
          />
          <TextField
            label="Correo"
            type="email"
            {...register("email", { required: true })}
            error={!!errors.email}
          />

          {!editing && (
            <TextField
              label="Contraseña"
              type="password"
              {...register("password", { required: true })}
              error={!!errors.password}
            />
          )}

          <TextField
            select
            label="Rol"
            defaultValue="student"
            {...register("role", { required: true })}
          >
            <MenuItem value="student">Estudiante</MenuItem>
            <MenuItem value="teacher">Profesor</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
          </TextField>

          <TextField
            select
            label="Estado"
            defaultValue="active"
            {...register("isActive", { required: true })}
          >
            <MenuItem value="true">Activo</MenuItem>
            <MenuItem value="false">Inactivo</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            variant="contained"
            type="submit"
            disabled={create.isPending || update.isPending}
          >
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
