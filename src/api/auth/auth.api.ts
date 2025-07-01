import { http } from '../../api/http';

/* Tipos */
export interface LoginDTO  { email: string; password: string; }
export interface User      { id:string; displayName:string; email:string; role:'admin'|'teacher'|'student'|'parent'; }
export interface LoginResp { token: string; user: User; }

/* Llamada HTTP – extraemos .data.data */
export const login = (payload: LoginDTO) =>
  http
    .post<{ data: LoginResp }>('/auth/login', payload)
    .then(res => res.data.data);
