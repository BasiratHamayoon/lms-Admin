// validationSchema.js
import * as Yup from 'yup';

export const emailValidation = Yup.string().email('Invalid email').required('Email is required');

export const loginSchema = Yup.object({
  email: emailValidation,
  password: Yup.string().required('Password is required')
});

export const userSchema = Yup.object({
  fullName: Yup.string().min(2, 'Full Name must be at least 2 characters').required('Full Name is required'),

  phone: Yup.string()
    .required('Phone number is required')
    .test('valid-phone', 'Phone must start with +92 or +966 and be 13 characters long', value => {
      if (!value) return false;
      const startsWithValidPrefix = value.startsWith('+92') || value.startsWith('+966');
      return startsWithValidPrefix && value.length === 13;
    }),

  email: emailValidation,
  password: Yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/,
      'Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be 8-15 characters long'
    ),
  status: Yup.string().required('Status is required')
});
