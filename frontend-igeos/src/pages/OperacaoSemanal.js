import React, { useEffect, useState, useMemo } from "react";
import api from "../service/api";
import {
  Table, TableBody, TableCell, TableContainer, TableRow,
  TablePagination, Paper, Typography, TextField, MenuItem, Collapse, Button, Box,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress
} from "@mui/material";
import { FilterList, CloudUpload, Add } from "@mui/icons-material";

const OperacaoSemanal = () => {
  const [dados, setDados] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openFilters, setOpenFilters] = useState(false);
  const [filtros, setFiltros] = useState({
    data: "",
    ano: "",
    mes: "",
    subSistema: "",
    custoMarginalMinimo: ""
  });

  const [openCSVModal, setOpenCSVModal] = useState(false);
  const [openManualModal, setOpenManualModal] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [manualData, setManualData] = useState({
    data: "",
    ano: "",
    mes: "",
    subSistema: "",
    custoMarginalOperacaoSemanalCargaPesada: "",
    custoMarginalOperacaoSemanalCargaMedia: "",
    custoMarginalOperacaoSemanalCargaLeve: "",
    custoMarginalOperacaoSemanal: ""
  });

  const [isLoading, setIsLoading] = useState(false);


  //Agrupar os dados para exibir os do mesmo dia
  const dadosAgrupados = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const dataKey = item.data;
      if (!acc[dataKey]) {
        acc[dataKey] = { data: dataKey, regioes: [] };
      }
      acc[dataKey].regioes.push(item);
      return acc;
    }, {});
  }, [filteredData]);

  //Buscar dados
  useEffect(() => {
    api.get("/operacao-semanal")
      .then(response => {
        const dados = response.data;
        setDados(dados);
        setFilteredData(dados);
      })
      .catch(error => console.error("Erro ao buscar dados:", error));
  }, []);

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
      const response = await api.post("/operacao-semanal/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response.data);
      setOpenCSVModal(false);

      const updatedData = await api.get("/operacao-semanal");
      setDados(updatedData.data);
      setFilteredData(updatedData.data);
    } catch (error) {
      console.error("Erro ao enviar arquivo CSV:", error);
      alert("Erro ao enviar arquivo CSV. Verifique o console para mais detalhes.");
    } finally {
      setIsLoading(false);
    }
  };

  //Adicionar Manual
  const handleManualSubmit = async () => {
    try {
      await api.post("/operacao-semanal", manualData);
      alert("Dados inseridos com sucesso!");
      setOpenManualModal(false);
      const updatedData = await api.get("/operacao-semanal");
      setDados(updatedData.data);
      setFilteredData(updatedData.data);
    } catch (error) {
      console.error("Erro ao inserir dados manualmente:", error);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const newFiltros = { ...filtros, [name]: value };
    setFiltros(newFiltros);

    const filtered = dados.filter((item) => {
      const dataFiltroISO = newFiltros.data ? new Date(newFiltros.data).toISOString().split('T')[0] : null;
      const dataItemISO = new Date(item.data).toISOString().split('T')[0];

      return (
        (!dataFiltroISO || dataItemISO === dataFiltroISO) &&
        (!newFiltros.ano || item.ano === newFiltros.ano) &&
        (!newFiltros.mes || item.mes === newFiltros.mes) &&
        (!newFiltros.subSistema || item.subSistema.toLowerCase() === newFiltros.subSistema.toLowerCase()) &&
        (!newFiltros.custoMarginalMinimo ||
          item.custoMarginalOperacaoSemanal >= parseFloat(newFiltros.custoMarginalMinimo))
      );
    });

    setFilteredData(filtered);
    setPage(0);
  };

  const handleClearFilters = () => {
    setFiltros({
      data: "",
      ano: "",
      mes: "",
      subSistema: "",
      custoMarginalMinimo: ""
    });
    setFilteredData(dados);
    setPage(0);
  };

  const paginatedData = useMemo(() => {
    const groupedArray = Object.values(dadosAgrupados).sort((a, b) => new Date(a.data) - new Date(b.data));
    return groupedArray.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [dadosAgrupados, page, rowsPerPage]);

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
          Operação Semanal
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
            Inserir Manualmente
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
      {/* Dialog adição manual */}
      <Dialog open={openManualModal} onClose={() => setOpenManualModal(false)}>
        <DialogTitle>Inserir Dados Manualmente</DialogTitle>
        <DialogContent>
          <TextField
            label="Data"
            name="data"
            type="date"
            value={manualData.data}
            onChange={handleManualInputChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
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
            name="subSistema"
            value={manualData.subSistema}
            onChange={handleManualInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Custo Marginal Carga Pesada"
            name="custoMarginalOperacaoSemanalCargaPesada"
            value={manualData.custoMarginalOperacaoSemanalCargaPesada}
            onChange={handleManualInputChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            label="Custo Marginal Carga Média"
            name="custoMarginalOperacaoSemanalCargaMedia"
            value={manualData.custoMarginalOperacaoSemanalCargaMedia}
            onChange={handleManualInputChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            label="Custo Marginal Carga Leve"
            name="custoMarginalOperacaoSemanalCargaLeve"
            value={manualData.custoMarginalOperacaoSemanalCargaLeve}
            onChange={handleManualInputChange}
            fullWidth
            margin="normal"
            type="number"
          />
          <TextField
            label="Custo Marginal"
            name="custoMarginalOperacaoSemanal"
            value={manualData.custoMarginalOperacaoSemanal}
            onChange={handleManualInputChange}
            fullWidth
            margin="normal"
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenManualModal(false)}>Cancelar</Button>
          <Button onClick={handleManualSubmit} color="primary">Salvar</Button>
        </DialogActions>
      </Dialog>
      {/* Filtros */}
      <Collapse in={openFilters}>
        <Box sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 2,
          mb: 3
        }}>
          <TextField
            label="Data"
            name="data"
            type="date"
            value={filtros.data}
            onChange={handleFilterChange}
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Ano"
            name="ano"
            value={filtros.ano}
            onChange={handleFilterChange}
            select
            fullWidth
            size="small"
          >
            {Array.from(new Set(dados.map((item) => item.ano)))
              .sort((a, b) => b - a)
              .map((ano) => (
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
            name="subSistema"
            value={filtros.subSistema}
            onChange={handleFilterChange}
            fullWidth
            select
            size="small"
          >
            {Array.from(new Set(dados.map((item) => item.subSistema)))
              .sort((a, b) => a - b)
              .map((subSistema) => (
                <MenuItem key={subSistema} value={subSistema}>
                  {subSistema}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            label="Custo Marginal Mínimo"
            name="custoMarginalMinimo"
            value={filtros.custoMarginalMinimo}
            onChange={handleFilterChange}
            fullWidth
            size="small"
            type="number"
          />
        </Box>
      </Collapse>

      {/* Tabela */}
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableBody>
            {paginatedData.map((row, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell colSpan={5} sx={{ border: "none" }}></TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={5} sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                    {new Date(row.data).toLocaleDateString("pt-BR")}
                  </TableCell>
                </TableRow>

                <TableRow sx={{ backgroundColor: "#e0e0e0", fontWeight: "bold" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Subsistema</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Carga Pesada</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Carga Média</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Carga Leve</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Carga Marginal</TableCell>
                </TableRow>

                {row.regioes.map((regiao, i) => (
                  <TableRow key={i}>
                    <TableCell>{regiao.subSistema}</TableCell>
                    <TableCell>{`R$ ${parseFloat(regiao.custoMarginalOperacaoSemanalCargaPesada).toLocaleString('pt-BR')} MWh`}</TableCell>
                    <TableCell>{`R$ ${parseFloat(regiao.custoMarginalOperacaoSemanalCargaMedia).toLocaleString('pt-BR')} MWh`}</TableCell>
                    <TableCell>{`R$ ${parseFloat(regiao.custoMarginalOperacaoSemanalCargaLeve).toLocaleString('pt-BR')} MWh`}</TableCell>
                    <TableCell>{`R$ ${parseFloat(regiao.custoMarginalOperacaoSemanal).toLocaleString('pt-BR')} MWh`}</TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={Object.values(dadosAgrupados).length}
        page={page}
        rowsPerPage={rowsPerPage}
        labelRowsPerPage="Linhas por página:"
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default OperacaoSemanal;