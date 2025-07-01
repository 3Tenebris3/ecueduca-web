import { useMutation } from '@tanstack/react-query';
import { login as loginApi } from '../../api/auth/auth.api';
import type { LoginDTO, LoginResp } from '../../api/auth/auth.api';
import { useAuth } from '../../core/auth';

export const useLogin = () => {
  const { login: save } = useAuth();

  return useMutation<LoginResp, Error, LoginDTO>({
    mutationFn: loginApi,
    onSuccess: ({ user, token }) => {
      if (user && token) save(user, token);   // ← nunca guardamos undefined
    },
    onError: (error) => {
      console.error('Error during login:', error);
      // Aquí podrías manejar el error, por ejemplo, mostrar un mensaje al usuario
    }
  });
};
