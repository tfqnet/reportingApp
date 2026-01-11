import { useEffect, useState } from 'react';
import { Box, Container, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import api from '../services/api';

interface Metrics {
  totalReports: number;
  openReports: number;
  unsafeActs: number;
  unsafeConditions: number;
  safetyExcellence: number;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics>({ totalReports: 0, openReports: 0, unsafeActs: 0, unsafeConditions: 0, safetyExcellence: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/dashboard/metrics');
        setMetrics(response.data.data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Safety metrics and recent activity
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary">
              Total Reports
            </Typography>
            <Typography variant="h3">{metrics.totalReports}</Typography>
            <Typography variant="body2" color="text.secondary">
              This month
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary">
              Open Reports
            </Typography>
            <Typography variant="h3">{metrics.openReports}</Typography>
            <Typography variant="body2" color="text.secondary">
              Pending action
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary">
              Unsafe Acts
            </Typography>
            <Typography variant="h3">{metrics.unsafeActs}</Typography>
            <Typography variant="body2" color="text.secondary">
              Reported
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" color="text.secondary">
              Unsafe Conditions
            </Typography>
            <Typography variant="h3">{metrics.unsafeConditions}</Typography>
            <Typography variant="body2" color="text.secondary">
              Reported
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, bgcolor: 'success.light' }}>
            <Typography variant="h6" color="text.secondary">
              Safety Excellence
            </Typography>
            <Typography variant="h3">{metrics.safetyExcellence}</Typography>
            <Typography variant="body2" color="text.secondary">
              Recognized
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                {metrics.totalReports === 0 
                  ? 'No reports yet. Create your first safety report to see activity here.'
                  : 'Recent reports will be displayed here.'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
