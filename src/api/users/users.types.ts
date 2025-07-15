export type Role = 'admin' | 'teacher' | 'student' | 'parent';

export interface UserDTO {
  isActive: boolean;
  id: string;
  displayName: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
}

export interface CreateUserDTO
  extends Omit<UserDTO, 'id'> { password: string; }

export type UpdateUserDTO = Partial<Omit<CreateUserDTO, 'password'>>;
