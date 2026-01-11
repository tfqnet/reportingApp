import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Box,
} from '@mui/material';
import api from '../services/api';

interface Report {
  id: string;
  reportNumber: string;
  type: string;
  title: string;
  status: string;
  submittedAt: string;
  submitter: {
    firstName: string;
    lastName: string;
  };
  site: {
    name: string;
  };
}

export default function ReportsPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/reports');
        setReports(response.data.data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: any = {
      open: 'error',
      in_progress: 'warning',
      resolved: 'info',
      closed: 'success',
    };
    return colors[status] || 'default';
  };

  const getTypeLabel = (type: string) => {
    return type === 'unsafe_act' ? 'Unsafe Act' : 'Unsafe Condition';
  };

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <div>
          <Typography variant="h4" gutterBottom>
            Safety Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage all safety reports
          </Typography>
        </div>
        <Button variant="contained" color="primary" onClick={() => navigate('/reports/new')}>
          New Report
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Report #</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Site</TableCell>
              <TableCell>Submitted By</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No reports found. Create your first safety report to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id} hover sx={{ cursor: 'pointer' }}>
                  <TableCell>{report.reportNumber}</TableCell>
                  <TableCell>
                    <Chip label={getTypeLabel(report.type)} size="small" />
                  </TableCell>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.site.name}</TableCell>
                  <TableCell>
                    {report.submitter.firstName} {report.submitter.lastName}
                  </TableCell>
                  <TableCell>
                    {new Date(report.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={report.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(report.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
