# Projeto Igeos - ONS

Este repositório contém um sistema de análise energética da **ONS**, uma plataforma para visualização de custos unitarios, operações semanais, operações semi-horarias e balanço energético, incluindo listagem de entidades, e filtragens que podem tornar os dados mais legiveis. O projeto é dividido em backend (Spring Boot) e frontend (React.js), além de um banco de dados (PostgreSQL) e docker para gestão de containers.

---

## Tecnologias Utilizadas

### Backend (Spring Boot)

* **Java 22**
* **Spring Boot** (Spring Web, Spring Data JPA)
* **PostgreSQL** (banco de dados)

### Frontend (React.js)

* **React.js** (framework principal)
* **Material UI** (estilização)
* **Recharts** (gráficos e visualização de dados)
* **Axios** (requisições HTTP)

---

## Configuração do Backend

### 1. Clonar o repositório

```
git clone https://github.com/Rubenscauan/igeos-teste-contratacao
```

### 2. Rodar o projeto com docker

```
docker-compose up --build
```

### 3. O sistema roda em

* **Frontend (localhost:3000)**
* **Backend (localhost:8080)**

---

## Funcionalidades

### Backend:

✅ CRUD para Balanço Energia Subsistema

✅ CRUD para Custo Variavel Unitario

✅ CRUD para Operação Semanal

✅ CRUD para Operação Semi Horario

✅ Integração com banco de dados postgreSQL

✅ Importação de dados via csv com OpenCSV

### Frontend:

✅ Pagina inicial

✅ Header Fixo que segue as paginas

✅ Gráficos interativos para análise de dados

✅ Design feito com Material UI

✅ Tabelas com filtros especificos para facilitar a visualização

---

## Motivos de Cada Visualização



## Contato

📧 Email: [rubenscauanfc2021@gmail.com]()
