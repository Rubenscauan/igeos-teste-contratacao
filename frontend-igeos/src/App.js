import React from "react";
import { BrowserRouter as Router, Route, Routes, Link as RouterLink } from "react-router-dom";
import { Link } from "@mui/material";
import CustoVariavelUnitario from "./pages/CustoVariavelUnitario";
import OperacaoSemanal from "./pages/OperacaoSemanal";
import BalancoEnergiaSubsistema from "./pages/BalancoEnergiaSubsistema";
import OperacaoSemiHorario from "./pages/OperacaoSemiHorario";
import HomePage from "./pages/HomePage";
import { 
  Box, 
  Container, 
  Grid
} from "@mui/material";
import logo from "./assets/Logo.ons.jpg"; 

function App() {
  return (
    <Router>
      <Box>
        <Box sx={{ 
          bgcolor: 'primary.dark', 
          py: 2,
          boxShadow: 3,
          position: 'sticky',
          top: 0,
          zIndex: 1100
        }}>
          <Container maxWidth="lg">
            <Grid container alignItems="center" spacing={4}>
              <Grid item>
                <Link component={RouterLink} to="/">
                  <img 
                    src={logo} 
                    alt="ONS" 
                    style={{ 
                      width: '120px', 
                      height: '60px', 
                      objectFit: 'contain' 
                    }} 
                  />
                </Link>
              </Grid>
              
              <Grid item xs container spacing={3} justifyContent="flex-end">
                <Grid item>
                  <Link 
                    component={RouterLink} 
                    to="/custo-variavel-unitario"
                    sx={{
                      color: 'common.white',
                      fontWeight: 500,
                      textDecoration: "none",
                      '&:hover': {
                        color: 'secondary.main'
                      }
                    }}
                  >
                    Custo Variável Unitário
                  </Link>
                </Grid>
                
                <Grid item>
                  <Link 
                    component={RouterLink} 
                    to="/operacao-semanal"
                    sx={{
                      color: 'common.white',
                      fontWeight: 500,
                      textDecoration: "none",
                      '&:hover': {
                        color: 'secondary.main'
                      }
                    }}
                  >
                    Operação Semanal
                  </Link>
                </Grid>
                
                <Grid item>
                  <Link 
                    component={RouterLink} 
                    to="/balanco-energia-subsistema"
                    sx={{
                      color: 'common.white',
                      fontWeight: 500,
                      textDecoration: "none",
                      '&:hover': {
                        color: 'secondary.main'
                      }
                    }}
                  >
                    Balanço de Energia
                  </Link>
                </Grid>
                
                <Grid item>
                  <Link 
                    component={RouterLink} 
                    to="/operacao-semi-horario"
                    sx={{
                      color: 'common.white',
                      fontWeight: 500,
                      textDecoration: "none",
                      '&:hover': {
                        color: 'secondary.main'
                      }
                    }}
                  >
                    Operação Semi-Horário
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/custo-variavel-unitario" element={<CustoVariavelUnitario />} />
          <Route path="/operacao-semanal" element={<OperacaoSemanal />} />
          <Route path="/balanco-energia-subsistema" element={<BalancoEnergiaSubsistema />} />
          <Route path="/operacao-semi-horario" element={<OperacaoSemiHorario />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
