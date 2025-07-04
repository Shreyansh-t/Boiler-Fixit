import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getServices } from '../services/api';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box
} from '@mui/material';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState('');
  const [savedDesc, setSavedDesc] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      const allServices = await getServices();
      const found = allServices.find(s => s._id === id);
      setService(found);
    };
    fetchService();
  }, [id]);

  if (!service) return <Container sx={{ mt: 4 }}><Typography>Loading...</Typography></Container>;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleProceed = () => {
    setSavedDesc(desc);
    setOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Card>
        <CardMedia
          component="img"
          image={service.imgUrl}
          alt={service.name}
          sx={{ width: '100%', height: 300, objectFit: 'cover' }}
        />
        <CardContent>
          <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
            {service.name}
          </Typography>
          <Button variant="contained" color="primary" fullWidth onClick={handleOpen} sx={{ mt: 2 }}>
            Add Description & Proceed
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Description</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            minRows={3}
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleProceed} variant="contained">Proceed</Button>
        </DialogActions>
      </Dialog>

      {savedDesc && (
        <Box mt={4}>
          <Typography variant="h6">Your Description:</Typography>
          <Typography>{savedDesc}</Typography>
        </Box>
      )}
    </Container>
  );
};

export default ServiceDetail; 