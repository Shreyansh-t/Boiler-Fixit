import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Link,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext.jsx';
import axios from 'axios';
import { useState, useContext } from 'react';
import {UserDataContext} from '../contexts/userContext'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      navigate('/');
    }
  };

  const {user, setUser} = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = {
      email: email,
      password: password,
    }
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/login`, userData);

    if(response.status === 200){
      const {token, user} = response.data;
      setUser(user);
      localStorage.setItem('token', token);
      navigate('/services');
    }else{
      console.log(response.data.message);
    }
    setEmail('');
    setPassword('');
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
            Login to BoilerFixIt
          </Typography>
          <form onSubmit={(e)=>{
            submitHandler(e);
        }}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              fullWidth
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/email-verification')}
                sx={{ textDecoration: 'none' }}
              >
                Don't have an account? Sign up
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 