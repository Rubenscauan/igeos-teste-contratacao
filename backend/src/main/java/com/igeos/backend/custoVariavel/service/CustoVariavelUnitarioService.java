package com.igeos.backend.custoVariavel.service;

import com.igeos.backend.custoVariavel.dto.request.CustoVariavelUnitarioRequest;
import com.igeos.backend.custoVariavel.model.CustoVariavelUnitario;
import com.igeos.backend.custoVariavel.repository.CustoVariavelUnitarioRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CustoVariavelUnitarioService {
    @Autowired
    private final CustoVariavelUnitarioRepository custoVariavelUnitarioRepositorrepository;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");


    public CustoVariavelUnitarioService(CustoVariavelUnitarioRepository custoVariavelUnitarioRepositorrepository) {
        this.custoVariavelUnitarioRepositorrepository = custoVariavelUnitarioRepositorrepository;
    }

    public CustoVariavelUnitario salvarCustoVariavelUnitario(CustoVariavelUnitarioRequest custoVariavelUnitarioRequest) {
        System.out.println("Dados recebidos: " + custoVariavelUnitarioRequest);

        CustoVariavelUnitario novoCustoVariavelUnitario = new CustoVariavelUnitario(); 
        novoCustoVariavelUnitario.setDataInicio(custoVariavelUnitarioRequest.dataInicio());
        novoCustoVariavelUnitario.setAno(custoVariavelUnitarioRequest.ano());
        novoCustoVariavelUnitario.setMes(custoVariavelUnitarioRequest.mes());
        novoCustoVariavelUnitario.setDataFim(custoVariavelUnitarioRequest.dataFim());
        novoCustoVariavelUnitario.setAnoPmo(custoVariavelUnitarioRequest.anoPmo());
        novoCustoVariavelUnitario.setMesPmo(custoVariavelUnitarioRequest.mesPmo());
        novoCustoVariavelUnitario.setNumeroRevisao(custoVariavelUnitarioRequest.numeroRevisao());
        novoCustoVariavelUnitario.setSemanaOperativa(custoVariavelUnitarioRequest.semanaOperativa());
        novoCustoVariavelUnitario.setIdModeloUsina(custoVariavelUnitarioRequest.idModeloUsina());
        novoCustoVariavelUnitario.setIdSubSistema(custoVariavelUnitarioRequest.idSubSistema());
        novoCustoVariavelUnitario.setSubSistema(custoVariavelUnitarioRequest.subSistema());
        novoCustoVariavelUnitario.setUsina(custoVariavelUnitarioRequest.usina());
        novoCustoVariavelUnitario.setCustoVariavelUnitario(custoVariavelUnitarioRequest.custoVariavelUnitario());    

        return custoVariavelUnitarioRepositorrepository.save(novoCustoVariavelUnitario);
    }

    public List<CustoVariavelUnitario> listarTodos() {
        return custoVariavelUnitarioRepositorrepository.findAll();
    }

    public Optional<CustoVariavelUnitario> buscarPorId(Long id) {
        return custoVariavelUnitarioRepositorrepository.findById(id);
    }

    public void deletarPorId(Long id) {
        custoVariavelUnitarioRepositorrepository.deleteById(id);
    }


    public void importarCSV(MultipartFile file) {
        try (InputStreamReader streamReader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVReader csvReader = new CSVReader(streamReader)) {

            List<CustoVariavelUnitario> lista = new ArrayList<>();
            String[] linha;
            boolean primeiraLinha = true;

            while ((linha = csvReader.readNext()) != null) {
                if (primeiraLinha) { // Ignorar cabeçalho
                    primeiraLinha = false;
                    continue;
                }

                CustoVariavelUnitario custo = new CustoVariavelUnitario();
                custo.setDataInicio(linha[0]);
                custo.setAno(Integer.parseInt(linha[1]));
                custo.setMes(Integer.parseInt(linha[2]));
                custo.setDataFim(linha[3]);
                custo.setAnoPmo(Integer.parseInt(linha[4]));
                custo.setMesPmo(Integer.parseInt(linha[5]));
                custo.setNumeroRevisao(Integer.parseInt(linha[6]));
                custo.setSemanaOperativa(linha[7]);
                custo.setIdModeloUsina(linha[8]);
                custo.setIdSubSistema(linha[9]);
                custo.setSubSistema(linha[10]);
                custo.setUsina(linha[11]);
                custo.setCustoVariavelUnitario((float) Double.parseDouble(linha[12]));

                lista.add(custo);
            }

            custoVariavelUnitarioRepositorrepository.saveAll(lista);
        } catch (IOException | CsvValidationException e) {
            throw new RuntimeException("Erro ao processar o arquivo CSV", e);
        }
    }
}
