import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext.jsx';

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  const { signup, loading, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const password = watch('password');
  const [error, setError] = useState('');

  // Get email and OTP from navigation state or localStorage
  useEffect(() => {
    const emailFromState = location.state?.email;
    const emailFromStorage = localStorage.getItem('signupEmail');
    const otpFromState = location.state?.otp;
    
    if (emailFromState) {
      setValue('email', emailFromState);
    } else if (emailFromStorage) {
      setValue('email', emailFromStorage);
    }
    
    if (otpFromState) {
      setValue('otp', otpFromState);
    }
  }, [location.state, setValue]);

  const onSubmit = async (data) => {
    try {
      console.log('Submitting signup form with data:', { ...data, password: '[REDACTED]' });
      setError('');
      const result = await signup(data);
      console.log('Signup result:', result);
      
      if (result.success) {
        console.log('Signup successful, navigating to home');
        // Clear stored email
        localStorage.removeItem('signupEmail');
        navigate('/');
      } else {
        console.error('Signup failed:', result.error);
        setError(result.error || 'Failed to create account');
      }
    } catch (err) {
      console.error('Error during signup:', err);
      setError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            Create an Account
          </Typography>
          {(error || authError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || authError}
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              {...register('fullName', {
                required: 'Full name is required',
              })}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="OTP Code"
              margin="normal"
              {...register('otp', {
                required: 'OTP is required',
                minLength: {
                  value: 6,
                  message: 'OTP must be 6 characters',
                },
                maxLength: {
                  value: 6,
                  message: 'OTP must be 6 characters',
                },
              })}
              error={!!errors.otp}
              helperText={errors.otp?.message}
              disabled={loading}
              placeholder="Enter 6-digit OTP"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              margin="normal"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value =>
                  value === password || 'The passwords do not match',
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ textDecoration: 'none' }}
                disabled={loading}
              >
                Already have an account? Login
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Signup; 