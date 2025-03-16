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

```bash
git clone https://github.com/Rubenscauan/igeos-teste-contratacao
```

### 2. Ir para pasta do projeto

```bash
cd igeos-teste-contratacao
```

### 3. Rodar o projeto com docker

```bash
docker-compose up --build
```

### 4. O sistema roda em

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

### Custo Variavel Unitario

Inicialmente Exibimos a tabela que recuperamos do BackEnd, contendo filtros basicos para a visualização, como Ano, mês, data inicio, data fim, subsitema e custo variavel, essa tabela por mais que seja bem basica é uma exibição que ja permite a um usuario que entenda o que está acontecendo.

O usuario também tem a opção de exibir um grafico. O gráfico contém informações relacionadas a o dia da revisão e o custo variavel no dia em especifico naquela revisão.

![Descrição da imagem](image\readme\Grafico.png "Gráfico de custo variavel unitario")

### Operação Semanal

Inicialmente Exibimos a tabela que recuperamos do BackEnd, contendo filtros basicos para a visualização porém com dados do mesmo dia agrupados, ja que o padrão se mantém como por exemplo tendo uma atualização a cada dia dos 4 subsistemas. Os filtros são Ano, mês, data especifica, subsitema e os custos marginais, possuindo o de carga leve, media e pesada, essa tabela por mais que seja bem basica é uma exibição que ja permite a um usuario que entenda o que está acontecendo. Com essas informações:

![Descrição da imagem](image\readme\TabelaOperacaoSemanal.png "Tabela Operação Semanal")

### Balanço de Energia (Dessem)

Inicialmente Exibimos a tabela que recuperamos do BackEnd, contendo filtros basicos para a visualização, como Ano, mês e subsistema, essa tabela por mais que seja bem basica é uma exibição que ja permite a um usuario que entenda o que está acontecendo.

O principal componente de exibição dela é a possibilidade de podermos ver os subsistemas que estão que abaixo do valor de demanda e os que estão acima (deficit e superavit), marcando em vermelho e verde. Além também de um botão para filtrarmos e vermos somente os subsistemas que estão em deficit.

![Descrição da imagem](image\readme\TabelaBalanceamentoSubsistema.png "Tabela Subsistema")

### Operação Semi Horario

Inicialmente Exibimos a tabela que recuperamos do BackEnd, contendo filtros basicos para a visualização, como Ano, mês, subsistema, hora e Custo marginal minimo, essa tabela por mais que seja bem basica é uma exibição que ja permite a um usuario que entenda o que está acontecendo.

Também temos a opção de fazer uma exibição em grafico, que nos mostra uma linha do tempo com os custos ao longo do dia, com base nos horarios que estão na tabela (a cada 30 minutos).

![Descrição da imagem](image\readme\GraficoOperacaoSemiHorario.png "Tabela Subsistema")

## Contato

📧 Email: [rubenscauanfc2021@gmail.com]()
