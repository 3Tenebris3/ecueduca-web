import { Dialog, DialogTitle, DialogContent, DialogActions, Button, ImageList, ImageListItem } from '@mui/material';
import { useState } from 'react';
import { useUpdateAvatar } from '../../features/users/hooks';

const avatars = Array.from({ length:20 }, (_,i)=>`avatar${i+1}.png`);

export default function AvatarDialog({ open, onClose, id }:{open:boolean; onClose:()=>void; id:string}) {
  const [sel,setSel]=useState('');
  const upd = useUpdateAvatar();
  const save = async () => { if(sel) { await upd.mutateAsync({id, avatar:sel}); onClose(); } };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Seleccionar avatar</DialogTitle>
      <DialogContent dividers>
        <ImageList cols={5} gap={12}>
          {avatars.map(a=>(
            <ImageListItem key={a} sx={{cursor:'pointer',border:sel===a?'2px solid #1976d2':''}}
              onClick={()=>setSel(a)}>
              <img src={`/avatars/${a}`} alt={a} loading="lazy"/>
            </ImageListItem>
          ))}
        </ImageList>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={save} disabled={!sel || upd.isPending}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}
