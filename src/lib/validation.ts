import { z } from 'zod';

// Common validation schemas
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

// Query retry configuration schema
export const queryRetrySchema = z.function()
  .args(
    z.number(),
    z.unknown()
  )
  .returns(z.boolean());

// Form error helper
export const getFormErrors = (error: z.ZodError) => {
  const errors: Record<string, string> = {};
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  return errors;
};

// Form validation helper
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): { data?: T; errors?: Record<string, string> } => {
  try {
    const validated = schema.parse(data);
    return { data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { errors: getFormErrors(error) };
    }
    return { errors: { _form: 'An unexpected error occurred' } };
  }
};
