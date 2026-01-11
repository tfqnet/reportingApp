import { Routes, Route } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          SafetyReport
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Multi-tenant safety reporting for Unsafe Acts and Unsafe Conditions
        </Typography>
        
        <Routes>
          <Route path="/" element={
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5">Welcome to SafetyReport</Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                System is being set up. Features coming soon:
              </Typography>
              <ul>
                <li>Dashboard with safety metrics</li>
                <li>Report submission and management</li>
                <li>User and site management</li>
                <li>Action tracking</li>
              </ul>
            </Box>
          } />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
