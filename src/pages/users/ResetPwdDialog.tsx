import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useResetPwd } from '../../features/users/hooks';

export default function ResetPwdDialog({ open, onClose, id }:{open:boolean; onClose:()=>void; id:string}) {
  const reset = useResetPwd();
  const handle = async () => { await reset.mutateAsync(id); onClose(); };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Resetear contraseña</DialogTitle>
      <DialogContent>
        <Typography>¿Seguro que deseas establecer la contraseña genérica <b>Educa123!</b>?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button color="error" onClick={handle} disabled={reset.isPending}>Resetear</Button>
      </DialogActions>
    </Dialog>
  );
}
