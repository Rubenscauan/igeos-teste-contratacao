import React, { useEffect, useState } from "react";
import api from "../service/api";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, Typography, TextField, MenuItem, Collapse, Button, Box
} from "@mui/material";
import { ArrowUpward, ArrowDownward, FilterList } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CustoVariavelUnitario = () => {
  const [dados, setDados] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("dataInicio");
  const [cvus, setCVUs] = useState([]);
  const [usina, setUsina] = useState("");

  const [filtros, setFiltros] = useState({
    ano: "",
    mes: "",
    dataInicio: "",
    dataFim: "",
    numeroRevisao: "",
    subSistema: "",
    usina: "",
    custoVariavelUnitario: ""
  });

  const [openFilters, setOpenFilters] = useState(false);
  const [handleGraphView, setHandleGraphView] = useState(false);

  useEffect(() => {
    api.get("custo-variavel")
      .then(response => {
        setDados(response.data);
        setFilteredData(response.data);
      })
      .catch(error => console.error("Erro ao buscar dados:", error));
  }, []);

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
        (!newFiltros.dataInicio || item.dataInicio >= newFiltros.dataInicio) &&
        (!newFiltros.dataFim || item.dataFim <= newFiltros.dataFim) &&
        (!newFiltros.numeroRevisao || item.numeroRevisao === newFiltros.numeroRevisao) &&
        (!newFiltros.subSistema || item.subSistema.toLowerCase().includes(newFiltros.subSistema.toLowerCase())) &&
        (!newFiltros.usina || item.usina.toLowerCase().includes(newFiltros.usina.toLowerCase())) &&
        (!newFiltros.custoVariavelUnitario || parseFloat(item.custoVariavelUnitario) >= parseFloat(newFiltros.custoVariavelUnitario))
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
      numeroRevisao: "",
      subSistema: "",
      usina: "",
      custoVariavelUnitario: ""
    });
    setFilteredData(dados);
    setPage(0);
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const getCVUFromUsina = (usina) => {
    const cvus = dados.filter(item => item.usina === usina);

    if (cvus.length > 0) {
      const cvuValues = cvus.map(item => {
        const dataInicio = new Date(item.dataInicio);
        const valor = item.custoVariavelUnitario;

        return { dataInicio, valor };
      });

      const orderedCVUValues = cvuValues.sort((a, b) => a.dataInicio - b.dataInicio);
      setCVUs(orderedCVUValues);
    } else {
      console.log("N/A");
    }
  };

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
          Custo Variável Unitário
        </Typography>

        <Box sx={{
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
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
            color="primary"
            onClick={() => setHandleGraphView(!handleGraphView)}
            sx={{ minWidth: 180 }}
          >
            {handleGraphView ? "Esconder Gráfico" : "Mostrar Gráfico"}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearFilters}
            sx={{ minWidth: 150 }}
          >
            Limpar Filtros
          </Button>
        </Box>
      </Box>

      <Collapse in={handleGraphView}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mb: 3
        }}>
          <TextField
            label="Defina a usina"
            name="usina"
            value={usina}
            onChange={(event) => {
              setUsina(event.target.value);
              getCVUFromUsina(event.target.value);
            }}
            select
            fullWidth
            size="small"
          >
            {Array.from(new Set(dados.map((item) => item.usina)))
              .sort((a, b) => a - b)
              .map((usina) => (
                <MenuItem key={usina} value={usina}>
                  {usina}
                </MenuItem>
              ))}
          </TextField>

          <Typography variant="h6" component="h6" sx={{
            fontWeight: "bold",
            textAlign: "center",
            mt: 2
          }}>
            Gráfico de Custo Variável Unitário
          </Typography>

          <Box sx={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cvus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="dataInicio"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                />
                <YAxis
                  tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                />
                <Tooltip
                  formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                  labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="valor"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Collapse>
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
            {Array.from(new Set(dados.map((item) => item.ano)))
              .sort((a, b) => a - b)
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
            label="Data Início"
            name="dataInicio"
            type="date"
            value={filtros.dataInicio}
            onChange={handleFilterChange}
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ minWidth: 120 }}
          />

          <TextField
            label="Data Fim"
            name="dataFim"
            type="date"
            value={filtros.dataFim}
            onChange={handleFilterChange}
            fullWidth
            size="small"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ minWidth: 120 }}
          />

          <TextField
            label="Número Revisão"
            name="numeroRevisao"
            value={filtros.numeroRevisao}
            onChange={handleFilterChange}
            select
            fullWidth
            size="small"
          >
            {Array.from(new Set(dados.map((item) => item.numeroRevisao)))
              .sort((a, b) => a - b)
              .map((numeroRevisao) => (
                <MenuItem key={numeroRevisao} value={numeroRevisao}>
                  {numeroRevisao}
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
            label="Usina"
            name="usina"
            value={filtros.usina}
            onChange={handleFilterChange}
            select
            fullWidth
            size="small"
          >
            {Array.from(new Set(dados.map((item) => item.usina)))
              .sort((a, b) => a - b)
              .map((usina) => (
                <MenuItem key={usina} value={usina}>
                  {usina}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            label="Custo Variável Unitário Mínimo"
            name="custoVariavelUnitario"
            value={filtros.custoVariavelUnitario}
            onChange={handleFilterChange}
            fullWidth
            size="small"
            type="number"
          />
        </Box>
      </Collapse>

      <Box sx={{
        position: 'relative',
        minHeight: 400,
        transition: 'all 0.3s ease'
      }}>
        <Collapse in={!handleGraphView}>
          <Box sx={{
            maxWidth: '100%',
            overflowX: 'auto',
            boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2)',
            borderRadius: 1
          }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {[
                      { label: "Data Início", key: "dataInicio" },
                      { label: "Data Fim", key: "dataFim" },
                      { label: "Ano", key: "ano" },
                      { label: "Mês", key: "mes" },
                      { label: "Número Revisão", key: "numeroRevisao" },
                      { label: "Semana Operativa", key: "semanaOperativa" },
                      { label: "ID Modelo Usina", key: "idModeloUsina" },
                      { label: "ID Subsistema", key: "idSubSistema" },
                      { label: "Subsistema", key: "subSistema" },
                      { label: "Usina", key: "usina" },
                      { label: "Custo Variável Unitário", key: "custoVariavelUnitario" },
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
                        {orderBy === key ? (
                          order === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                        ) : null}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{new Date(row.dataInicio).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{new Date(row.dataFim).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{row.ano}</TableCell>
                      <TableCell>{row.mes}</TableCell>
                      <TableCell>{row.numeroRevisao}</TableCell>
                      <TableCell>{row.semanaOperativa}</TableCell>
                      <TableCell>{row.idModeloUsina}</TableCell>
                      <TableCell>{row.idSubSistema}</TableCell>
                      <TableCell>{row.subSistema}</TableCell>
                      <TableCell>{row.usina}</TableCell>
                      <TableCell>
                        {row.custoVariavelUnitario ?
                          `R$ ${parseFloat(row.custoVariavelUnitario).toLocaleString('pt-BR')} / MWh` :
                          "N/A"
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: '1px solid rgba(224, 224, 224, 1)',
                pr: 2
              }}
            />
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};

export default CustoVariavelUnitario;