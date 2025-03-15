// HomePage.js
import React from "react";
import { 
  Typography, 
  Paper, 
  Box, 
  Container, 
  useTheme 
} from "@mui/material";
import {
  TaskAlt as WelcomeIcon
} from "@mui/icons-material";

const HomePage = () => {
  const theme = useTheme();

  return (
    <Box sx={{ background: `linear-gradient(45deg, ${theme.palette.background.default} 30%, ${theme.palette.action.hover} 90%)` }}>
      

      <Container maxWidth="lg" sx={{ py: 8, minHeight: '100vh' }}>
        <WelcomeIcon 
          sx={{ 
            fontSize: 80, 
            mb: 4, 
            color: 'primary.main',
            mx: 'auto',
            display: 'block'
          }} 
        />
        
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            textAlign: "center",
            mb: 4,
            color: 'text.primary',
            [theme.breakpoints.down('sm')]: {
              fontSize: '2.5rem'
            }
          }}
        >
          Sistema de Análises Energéticas
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ 
            padding: 4,
            margin: 2,
            maxWidth: 800,
            borderRadius: 4,
            borderLeft: `6px solid ${theme.palette.primary.main}`,
            backgroundColor: 'background.paper',
            mx: 'auto'
          }}
        >
          <Typography 
            variant="h6" 
            component="p" 
            sx={{ 
              mb: 2,
              lineHeight: 1.6,
              color: 'text.secondary',
              textAlign: 'center'
            }}
          >
            Plataforma integrada para gestão e análise de dados energéticos do Operador Nacional do Sistema
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;