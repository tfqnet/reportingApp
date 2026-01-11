import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
} from '@mui/material';

export default function NewReportPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    locationDescription: '',
    immediateActionTaken: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/reports', formData);
      navigate('/reports');
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to create report. Please try again.');
      console.error('Submit error:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        New Safety Report
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Report an unsafe act or unsafe condition
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Report Type *</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              label="Report Type *"
              required
            >
              <MenuItem value="unsafe_act">Unsafe Act</MenuItem>
              <MenuItem value="unsafe_condition">Unsafe Condition</MenuItem>
              <MenuItem value="safety_excellence">Safety Excellence</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Title *"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Description *"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={4}
            required
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Location"
            value={formData.locationDescription}
            onChange={(e) => handleChange('locationDescription', e.target.value)}
            placeholder="e.g., Near drilling rig #3, 2nd floor"
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Immediate Action Taken"
            value={formData.immediateActionTaken}
            onChange={(e) => handleChange('immediateActionTaken', e.target.value)}
            multiline
            rows={3}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Report'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/reports')}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
