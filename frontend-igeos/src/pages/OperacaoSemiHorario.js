import React, { useEffect, useState } from "react";
import api from "../service/api";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Paper, Typography, Button, TextField, Collapse, MenuItem, Box
} from "@mui/material";
import { ArrowUpward, ArrowDownward, FilterList } from "@mui/icons-material";
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { Chart, LinearScale, CategoryScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

Chart.register(LinearScale, CategoryScale, PointElement, LineElement, Tooltip, Legend);

const OperacaoSemiHorario = () => {
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
    subSistema: "",
    custoMarginalOperacao: "",
    hora: "",
  });
  const [openFilters, setOpenFilters] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSubsistema, setSelectedSubsistema] = useState("");

  useEffect(() => {
    api.get("/operacao-semi-horario")
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
        (!newFiltros.dataInicio || item.data >= newFiltros.dataInicio) &&
        (!newFiltros.dataFim || item.data <= newFiltros.dataFim) &&
        (!newFiltros.subSistema || item.subSistema.toLowerCase().includes(newFiltros.subSistema.toLowerCase())) &&
        (!newFiltros.custoMarginalOperacao || item.custoMarginalOperacao >= parseFloat(newFiltros.custoMarginalOperacao)) &&
        (!newFiltros.hora || item.hora === newFiltros.hora)
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
      subSistema: "",
      custoMarginalOperacao: "",
      hora: "",
    });
    setFilteredData(dados);
    setPage(0);
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (orderBy === 'hora') {
      const [horaA, minA] = a.hora.split(':').map(Number);
      const [horaB, minB] = b.hora.split(':').map(Number);
      return order === 'asc' ? (horaA * 60 + minA) - (horaB * 60 + minB) : (horaB * 60 + minB) - (horaA * 60 + minA);
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

  const groupDataByDayAndSubsistema = () => {
    const grouped = {};

    filteredData.forEach(item => {
      const key = `${item.data}-${item.subSistema}`;
      if (!grouped[key]) {
        grouped[key] = {
          data: item.data,
          subsistema: item.subSistema,
          valores: []
        };
      }
      grouped[key].valores.push({
        hora: item.hora,
        custo: item.custoMarginalOperacao
      });
    });

    Object.values(grouped).forEach(group => {
      group.valores.sort((a, b) => {
        const [hA, mA] = a.hora.split(':').map(Number);
        const [hB, mB] = b.hora.split(':').map(Number);
        return (hA * 60 + mA) - (hB * 60 + mB);
      });
    });

    return grouped;
  };

  const getChartData = () => {
    const grouped = groupDataByDayAndSubsistema();
    const key = `${selectedDay}-${selectedSubsistema}`;
    const data = grouped[key]?.valores || [];

    return {
      labels: data.map(d => d.hora),
      datasets: [{
        label: `Custo Marginal - ${selectedSubsistema}`,
        data: data.map(d => d.custo),
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.1,
        pointRadius: 3,
        pointHoverRadius: 5
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => `R$ ${context.raw.toLocaleString('pt-BR')} /MWh`
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Horário',
          font: {
            size: 12
          }
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Custo Marginal (R$/MWh)',
          font: {
            size: 12
          }
        },
        ticks: {
          callback: (value) => `R$ ${value.toLocaleString('pt-BR')}`,
          font: {
            size: 12
          }
        }
      }
    }
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
          Operação Semi-Horária
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
            color="secondary"
            onClick={handleClearFilters}
            sx={{ minWidth: 150 }}
          >
            Limpar Filtros
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => setShowGraph(!showGraph)}
            sx={{ minWidth: 180 }}
          >
            {showGraph ? "Mostrar Tabela" : "Mostrar Gráfico"}
          </Button>
        </Box>
      </Box>

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
            name="subSistema"
            value={filtros.subSistema}
            onChange={handleFilterChange}
            fullWidth
            select
            size="small"
          >
            {Array.from(new Set(dados.map((item) => item.subSistema))).map((subsistema) => (
              <MenuItem key={subsistema} value={subsistema}>
                {subsistema}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Custo Marginal Mínimo"
            name="custoMarginalOperacao"
            value={filtros.custoMarginalOperacao}
            onChange={handleFilterChange}
            fullWidth
            size="small"
            type="number"
          />

          <TextField
            label="Hora"
            name="hora"
            value={filtros.hora}
            onChange={handleFilterChange}
            select
            fullWidth
            size="small"
          >
            {Array.from(new Set(dados.map((item) => item.hora)))
              .sort((a, b) => {
                const [horaA, minA] = a.split(':').map(Number);
                const [horaB, minB] = b.split(':').map(Number);
                return (horaA * 60 + minA) - (horaB * 60 + minB);
              })
              .map((hora) => (
                <MenuItem key={hora} value={hora}>
                  {hora}
                </MenuItem>
              ))}
          </TextField>
        </Box>
      </Collapse>

      <Box sx={{
        position: 'relative',
        minHeight: 400,
        transition: 'all 0.3s ease'
      }}>
        <Collapse in={showGraph}>
          <Box sx={{
            display: "flex",
            flexDirection: 'column',
            gap: 2,
            mb: 3,
            height: '100%'
          }}>
            <Box sx={{
              display: "flex",
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <TextField
                label="Selecione o Dia"
                type="date"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ minWidth: 200 }}
              />

              <TextField
                select
                label="Selecione o Subsistema"
                value={selectedSubsistema}
                onChange={(e) => setSelectedSubsistema(e.target.value)}
                sx={{ minWidth: 200 }}
              >
                {Array.from(new Set(filteredData.map((item) => item.subSistema))).map((subsistema) => (
                  <MenuItem key={subsistema} value={subsistema}>
                    {subsistema}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {selectedDay && selectedSubsistema && (
              <Box sx={{
                height: 300,
                width: '100%',
                position: 'relative',
                mx: 'auto'
              }}>
                {getChartData() && (
                  <Line
                    data={getChartData()}
                    options={chartOptions}
                    key={`${selectedDay}-${selectedSubsistema}`}
                  />
                )}
              </Box>
            )}
          </Box>
        </Collapse>

        <Collapse in={!showGraph}>
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
                      { label: "Data", key: "data" },
                      { label: "Ano", key: "ano" },
                      { label: "Mês", key: "mes" },
                      { label: "Hora", key: "hora" },
                      { label: "ID Subsistema", key: "idSubSistema" },
                      { label: "Subsistema", key: "subSistema" },
                      { label: "Custo Marginal", key: "custoMarginalOperacao" },
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
                      <TableCell>{row.data}</TableCell>
                      <TableCell>{row.ano}</TableCell>
                      <TableCell>{row.mes}</TableCell>
                      <TableCell>{row.hora}</TableCell>
                      <TableCell>{row.idSubSistema}</TableCell>
                      <TableCell>{row.subSistema}</TableCell>
                      <TableCell>{`R$ ${row.custoMarginalOperacao.toLocaleString("pt-BR")}`} /MWh</TableCell>
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
              labelRowsPerPage="Linhas por página:"
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

export default OperacaoSemiHorario;