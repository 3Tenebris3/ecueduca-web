import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLogin } from '../../features/auth/hooks';
import {
  Box, TextField, Button, Typography, Paper, Menu, MenuItem
} from '@mui/material';
import { useAuth } from '../../core/auth';

export default function LoginPage() {
  const nav = useNavigate();
  const { register, handleSubmit } = useForm<{ email: string; password: string }>();
  const login = useLogin();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const submit = handleSubmit(data => {
    login.mutate(data, { onSuccess: () => {
      nav('/dashboard')
      notify({
        title: 'Inicio de sesión exitoso',
        description: 'Bienvenido de nuevo!',
        severity: 'success'
      });
    }, 
    onError: () => {
      notify({
        title: 'Error de inicio de sesión',
        description: 'Por favor, verifica tus credenciales.',
        severity: 'error'
      });
    }});
  });

  const handleDemoClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const { notify } = useAuth();

  const handleDemoLogin = (role: 'admin' | 'profesor') => {
    const demoCredentials =
      role === 'admin'
        ? { email: 'admin@demo.com', password: 'Password01' }
        : { email: 'profesor@demo.com', password: 'Password01' };

    login.mutate(demoCredentials, { onSuccess: () => {
      nav('/dashboard')
      notify({
        title: 'Inicio de sesión exitoso',
        description: 'Bienvenido de nuevo!',
        severity: 'success'
      });
    },
    onError: () => {
      notify({
        title: 'Error de inicio de sesión',
        description: 'Por favor, verifica tus credenciales.',
        severity: 'error'
      });
    }});
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Imagen lateral */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: `url(https://static.casadomo.com/media/2024/05/redes-realidad-virtual-aumentada-proyectos-pilotos-5g.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'end',
          display: { xs: 'none', md: 'block' }
        }}
      />

      {/* Formulario */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          backgroundColor: '#f9fafb'
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 5,
            width: '100%',
            maxWidth: 420,
            borderRadius: 4
          }}
        >
          <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 700, mb: 1, color: '#1d4ed8' }}>
            Ecueduca
          </Typography>
          <Typography variant="subtitle1" sx={{ textAlign: 'center', color: '#64748b', mb: 4 }}>
            Inicia sesión para continuar
          </Typography>

          <form onSubmit={submit}>
            <TextField
              label="Correo electrónico"
              type="email"
              {...register('email', { required: true })}
              fullWidth
              sx={{ mb: 3 }}
            />
            <TextField
              label="Contraseña"
              type="password"
              {...register('password', { required: true })}
              fullWidth
              sx={{ mb: 4 }}
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={login.isPending}
              sx={{
                py: 1.5,
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                backgroundColor: '#3b82f6',
                '&:hover': {
                  backgroundColor: '#2563eb'
                }
              }}
            >
              {login.isPending ? '...' : 'Entrar'}
            </Button>
          </form>

          {/* Botón Demo */}
          <Button
            variant="text"
            fullWidth
            onClick={handleDemoClick}
            sx={{ mt: 2, textTransform: 'none', color: '#1d4ed8', fontWeight: 500 }}
          >
            Demo
          </Button>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={() => handleDemoLogin('admin')}>Demo Administrador</MenuItem>
            <MenuItem onClick={() => handleDemoLogin('profesor')}>Demo Profesor</MenuItem>
          </Menu>
        </Paper>
      </Box>
    </Box>
  );
}
