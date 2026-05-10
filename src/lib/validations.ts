import { z } from 'zod';

// Schema para login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña es requerida'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Schema para crear/editar usuario
export const userSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(100, 'Nombre muy largo'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres').optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
  roleId: z.number().int().positive('Debe seleccionar un rol'),
  isActive: z.boolean().default(true),
}).refine((data) => {
  // Solo validar contraseña si se está creando un usuario nuevo o si se proporciona una
  if (data.password || data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type UserFormData = z.infer<typeof userSchema>;

// Schema para crear/editar rol
export const roleSchema = z.object({
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(50, 'Nombre muy largo'),
  description: z.string().min(5, 'Descripción muy corta').max(255, 'Descripción muy larga'),
});

export type RoleFormData = z.infer<typeof roleSchema>;

// Schema para crear/editar permiso
export const permissionSchema = z.object({
  name: z.string().min(3, 'Nombre muy corto').max(100, 'Nombre muy largo'),
  description: z.string().min(5, 'Descripción muy corta').max(255, 'Descripción muy larga'),
  resource: z.string().min(1, 'Recurso es requerido').max(50, 'Recurso muy largo'),
  action: z.enum(['create', 'read', 'update', 'delete'], {
    errorMap: () => ({ message: 'Debe seleccionar una acción' }),
  }),
});

export type PermissionFormData = z.infer<typeof permissionSchema>;

// Schema para recuperación de contraseña
export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Schema para reset de contraseña
export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;