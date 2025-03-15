import React, { useEffect, useState } from "react";
import api from "../service/api";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, Typography, TextField, MenuItem, Collapse, Button, Box, 
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress
} from "@mui/material";
import { CloudUpload, Add } from "@mui/icons-material";
import { ArrowUpward, ArrowDownward, FilterList } from "@mui/icons-material";

const BalancoEnergiaSubsistema = () => {
  const [dados, setDados] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("data");
  const [filtros, setFiltros] = useState({
    ano: "",
    mes: "",
    dataInicio: "",
    dataFim: "",
    subsistema: "",
    valorDemanda: "",
  });

  const [openFilters, setOpenFilters] = useState(false);
  const [showBelowDemand, setShowBelowDemand] = useState(false);

  const [openCSVModal, setOpenCSVModal] = useState(false);
  const [openManualModal, setOpenManualModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [manualData, setManualData] = useState({
    ano: "",
    mes: "",
    subsistema: "",
    geracaoEolicaVerificada: "",
    geracaoFotovoltaicaVerificada: "",
    usinaHidraulicaVerificada: "",
    geracaoPequenaUsinaHidraulicaVerificada: "",
    geracaoUsinaTermicaVerificada: "",
    geracaoPequenaUsinaTermicaVerificada: "",
    valorDemanda: "",
  });

  const [isLoading, setIsLoading] = useState(false); 
  

  const handleCSVUpload = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleManualInputChange = (event) => {
    const { name, value } = event.target;
    setManualData({ ...manualData, [name]: value });
  };

  //Adicionar via csv
  const handleCSVSubmit = async () => {
    if (!csvFile) {
      alert("Por favor, selecione um arquivo CSV.");
      return;
    }
    
    setIsLoading(true); 
    const formData = new FormData();
    formData.append("file", csvFile);
  
    try {
      const response = await api.post("/balanco-energia-subsistema/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data);
      setOpenCSVModal(false);
  
      const updatedData = await api.get("/balanco-energia-subsistema");
      setDados(updatedData.data);
      setFilteredData(updatedData.data);
    } catch (error) {
      console.error("Erro ao enviar arquivo CSV:", error);
      alert("Erro ao enviar arquivo CSV. Verifique o console para mais detalhes.");
    } finally {
      setIsLoading(false);
    }
  };

  //Adicionar via Manual
  const handleManualSubmit = async () => {
    try {
      await api.post("/balanco-energia-subsistema", manualData);
      alert("Dados inseridos com sucesso!");
      setOpenManualModal(false);
      const updatedData = await api.get("/balanco-energia-subsistema");
      setDados(updatedData.data);
      setFilteredData(updatedData.data);
    } catch (error) {
      console.error("Erro ao inserir dados manualmente:", error);
    }
  };

  //Obter todos os dados
  useEffect(() => {
    api.get("/balanco-energia-subsistema")
      .then(response => {
        setDados(response.data);
        setFilteredData(response.data);
      })
      .catch(error => console.error("Erro ao buscar dados:", error));
  }, []);

  const handleSumGeneration = (row) => {
    return (
      row.geracaoEolicaVerificada +
      row.geracaoFotovoltaicaVerificada +
      row.usinaHidraulicaVerificada +
      row.geracaoPequenaUsinaHidraulicaVerificada +
      row.geracaoUsinaTermicaVerificada +
      row.geracaoPequenaUsinaTermicaVerificada
    );
  };

  const calcularDeficit = (row) => {
    return row.valorDemanda - handleSumGeneration(row);
  };

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const newFiltros = { ...filtros, [name]: value };
    setFiltros(newFiltros);

    const newFilteredData = dados.filter((item) => {
      return (
        (!newFiltros.ano || item.ano === newFiltros.ano) &&
        (!newFiltros.mes || item.mes === newFiltros.mes) &&
        (!newFiltros.subsistema || item.subsistema?.toLowerCase().includes(newFiltros.subsistema?.toLowerCase())) &&
        (!newFiltros.valorDemanda || item.valorDemanda.toString().includes(newFiltros.valorDemanda))
      );
    });

    setFilteredData(newFilteredData);
    setPage(0);
  };

  const handleClearFilters = () => {
    setFiltros({
      ano: "",
      mes: "",
      dataInicio: "",
      dataFim: "",
      subsistema: "",
      valorDemanda: "",
    });
    setFilteredData(dados);
    setPage(0);
  };

  const handleToggleShowBelowDemand = () => {
    setShowBelowDemand(!showBelowDemand);
    const newFilteredData = dados.filter((item) => {
      const somaGeracoes = handleSumGeneration(item);
      return somaGeracoes < item.valorDemanda;
    });
    setFilteredData(showBelowDemand ? dados : newFilteredData);
  };

  //Organizar por maiores deficits 

  const sortedData = [...filteredData].sort((a, b) => {
    if (orderBy === 'deficit') {
      const deficitA = calcularDeficit(a);
      const deficitB = calcularDeficit(b);
      return order === 'asc' ? deficitA - deficitB : deficitB - deficitA;
    }

    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ 
      width: "95%", 
      margin: "20px auto", 
      padding: 2, 
      marginTop: "80px",
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3
      }}>
        <Typography variant="h5" component="h1" sx={{ 
          fontWeight: "bold",
          flexGrow: 1
        }}>
          Balanço da Geração de Energia por Subsistema
        </Typography>

      {/* Botões */}
        <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          flexGrow: 1
        }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FilterList />}
            onClick={() => setOpenFilters(!openFilters)}
            sx={{ minWidth: 180 }}
          >
            {openFilters ? "Esconder Filtros" : "Mostrar Filtros"}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearFilters}
            sx={{ minWidth: 150 }}
          >
            Limpar Filtros
          </Button>

          <Button
            variant="contained"
            color={showBelowDemand ? "primary" : "secondary"}
            onClick={handleToggleShowBelowDemand}
            sx={{ minWidth: 220 }}
          >
            {showBelowDemand ? "Exibir Tudo" : "Exibir Deficits"}
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUpload />}
            onClick={() => setOpenCSVModal(true)}
            sx={{ minWidth: 180 }}
          >
            Upload CSV
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpenManualModal(true)}
            sx={{ minWidth: 180 }}
          >
            Inserir Dados
          </Button>
        </Box>
      </Box>
      {/* Dialog de Upload */}

      <Dialog open={openCSVModal} onClose={() => setOpenCSVModal(false)}>
        <DialogTitle>Upload de Arquivo CSV</DialogTitle>
        <DialogContent>
          <input type="file" accept=".csv" onChange={handleCSVUpload} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCSVModal(false)}>Cancelar</Button>
          <Button onClick={handleCSVSubmit} color="primary" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : "Enviar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Manual */}
      <Dialog open={openManualModal} onClose={() => setOpenManualModal(false)}>
        <DialogTitle>Inserir Dados Manualmente</DialogTitle>
        <DialogContent>
          <TextField
            label="Ano"
            name="ano"
            value={manualData.ano}
            onChange={handleManualInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mês"
            name="mes"
            value={manualData.mes}
            onChange={handleManualInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Subsistema"
            name="subsistema"
            value={manualData.subsistema}
            onChange={handleManualInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Geração Eólica"
            name="geracaoEolicaVerificada"
            value={manualData.geracaoEolicaVerificada}
            onChange={handleManualInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Geração Fotovoltaica"
            name="geracaoFotovoltaicaVerificada"
            value={manualData.geracaoFotovoltaicaVerificada}
            onChange={handleManualInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Usina Hidráulica"
            name="usinaHidraulicaVerificada"
            value={manualData.usinaHidraulicaVerificada}
            onChange={handleManualInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="P. Usina Hidráulica"
            name="geracaoPequenaUsinaHidraulicaVerificada"
            value={manualData.geracaoPequenaUsinaHidraulicaVerificada}
            onChange={handleManualInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Geração Térmica"
            name="geracaoUsinaTermicaVerificada"
            value={manualData.geracaoUsinaTermicaVerificada}
            onChange={handleManualInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="P. Usina Térmica"
            name="geracaoPequenaUsinaTermicaVerificada"
            value={manualData.geracaoPequenaUsinaTermicaVerificada}
            onChange={handleManualInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Valor da Demanda"
            name="valorDemanda"
            value={manualData.valorDemanda}
            onChange={handleManualInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenManualModal(false)}>Cancelar</Button>
          <Button onClick={handleManualSubmit} color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>

      {/* Exibição dos filtros */}
      <Collapse in={openFilters}>
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 2,
          mb: 3
        }}>
          <TextField
            label="Ano"
            name="ano"
            value={filtros.ano}
            onChange={handleFilterChange}
            select
            fullWidth
            size="small"
          >
            {Array.from(new Set(dados.map((item) => item.ano))).map((ano) => (
              <MenuItem key={ano} value={ano}>
                {ano}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Mês"
            name="mes"
            value={filtros.mes}
            onChange={handleFilterChange}
            select
            fullWidth
            size="small"
          >
            {Array.from(new Set(dados.map((item) => item.mes)))
              .sort((a, b) => a - b)
              .map((mes) => (
                <MenuItem key={mes} value={mes}>
                  {mes}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            label="Subsistema"
            name="subsistema"
            value={filtros.subsistema}
            onChange={handleFilterChange}
            select
            fullWidth
            size="small"
          >
            {Array.from(new Set(dados.map((item) => item.subsistema)))
              .sort((a, b) => a - b)
              .map((subsistema) => (
                <MenuItem key={subsistema} value={subsistema}>
                  {subsistema}
                </MenuItem>
              ))}
          </TextField>
        </Box>
      </Collapse>
      {/* Tabela */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { label: "Ano", key: "ano" },
                { label: "Mês", key: "mes" },
                { label: "Subsistema", key: "subsistema" },
                { label: "Eólica", key: "geracaoEolicaVerificada" },
                { label: "Fotovoltaica", key: "geracaoFotovoltaicaVerificada" },
                { label: "Usina Hidráulica", key: "usinaHidraulicaVerificada" },
                { label: "P. Usina Hidráulica", key: "geracaoPequenaUsinaHidraulicaVerificada" },
                { label: "Térmica", key: "geracaoUsinaTermicaVerificada" },
                { label: "P. Usina Térmica", key: "geracaoPequenaUsinaTermicaVerificada" },
                { label: "Demanda", key: "valorDemanda" },
                { label: "Deficit / Superavit", key: "deficit" }
              ].map(({ label, key }) => (
                <TableCell 
                  key={key} 
                  onClick={() => handleSort(key)} 
                  sx={{ 
                    fontWeight: "bold", 
                    cursor: "pointer",
                    whiteSpace: 'nowrap'
                  }}
                >
                  {label}
                  {orderBy === key ? (order === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />) : null}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const deficit = calcularDeficit(row);
                const isDeficit = deficit > 0;
                const percentualDeficit = ((deficit / row.valorDemanda) * 100).toFixed(1);

                return (
                  <TableRow key={index}>
                    <TableCell>{row.ano}</TableCell>
                    <TableCell>{row.mes}</TableCell>
                    <TableCell>{row.subsistema}</TableCell>
                    <TableCell>{Math.abs(row.geracaoEolicaVerificada).toLocaleString('pt-BR')}{" Mwmed"}</TableCell>
                    <TableCell>{Math.abs(row.geracaoFotovoltaicaVerificada).toLocaleString('pt-BR')}{" Mwmed"}</TableCell>
                    <TableCell>{Math.abs(row.usinaHidraulicaVerificada).toLocaleString('pt-BR')}{" Mwmed"}</TableCell>
                    <TableCell>{Math.abs(row.geracaoPequenaUsinaHidraulicaVerificada).toLocaleString('pt-BR')}{" Mwmed"}</TableCell>
                    <TableCell>{Math.abs(row.geracaoUsinaTermicaVerificada).toLocaleString('pt-BR')}{" Mwmed"}</TableCell>
                    <TableCell>{Math.abs(row.geracaoPequenaUsinaTermicaVerificada).toLocaleString('pt-BR')}{" Mwmed"}</TableCell>
                    <TableCell>{Math.abs(row.valorDemanda).toLocaleString('pt-BR')}{" Mwmed"}</TableCell>
                    <TableCell
                      sx={{
                        fontFamily: 'Monospace',
                        fontWeight: 600,
                        color: isDeficit ? '#d32f2f' : '#2e7d32'
                      }}
                    >
                      {Math.abs(deficit).toLocaleString('pt-BR')} Mwmed
                      {isDeficit ? (
                        <span style={{ marginLeft: '8px', fontSize: '0.8em', color: '#d32f2f' }}>
                          ({percentualDeficit}%)
                        </span>
                      ) : <span style={{ marginLeft: '8px', fontSize: '0.8em', color: 'green' }}>
                        ({(Math.abs(percentualDeficit)).toFixed(1)} % )
                      </span>}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        labelRowsPerPage="Linhas por página:"
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default BalancoEnergiaSubsistema;