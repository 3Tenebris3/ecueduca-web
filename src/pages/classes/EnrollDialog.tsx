import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  List,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { useStudents } from "../../features/users/hooks";
import { useStudentsInClass, useEnroll } from "../../features/classes/hooks";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  classId: string;
}

export default function EnrollDialog({ open, onClose, classId }: Props) {
  const { data: allStudents = [] } = useStudents(); // todos
  const { data: current = [] } = useStudentsInClass(classId); // ya inscritos
  const enroll = useEnroll();

  const [selected, setSel] = useState<string[]>(current.map((s) => s.id));

  const toggle = (id: string) =>
    setSel((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const save = async () => {
    // añade/quita según diferencia
    const toAdd = selected.filter((id) => !current.find((s) => s.id === id));
    const toRemove = current
      .filter((s) => !selected.includes(s.id))
      .map((s) => s.id);

    await Promise.all([
      ...toAdd.map((id) =>
        enroll.mutateAsync({ studentId: id, classId, action: "add" })
      ),
      ...toRemove.map((id) =>
        enroll.mutateAsync({ studentId: id, classId, action: "remove" })
      ),
    ]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Matricular estudiantes</DialogTitle>
      <DialogContent dividers sx={{ maxHeight: 400 }}>
        <List dense>
          {allStudents.map((st) => (
            <ListItemButton key={st.id} onClick={() => toggle(st.id)}>
              <Checkbox edge="start" checked={selected.includes(st.id)} />
              <ListItemText primary={st.displayName} secondary={st.email} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={save}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
