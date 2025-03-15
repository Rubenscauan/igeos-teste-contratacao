package com.igeos.backend.custoMarginal.operacaoSemanal.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.igeos.backend.balancoEnergiaSubsistema.dto.BalancoEnergiaSubsistemaRequest;
import com.igeos.backend.balancoEnergiaSubsistema.model.BalancoEnergiaSubsistema;
import com.igeos.backend.custoMarginal.operacaoSemanal.dto.request.OperacaoSemanalRequest;
import com.igeos.backend.custoMarginal.operacaoSemanal.model.OperacaoSemanal;
import com.igeos.backend.custoMarginal.operacaoSemanal.repository.OperacaoSemanalRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OperacaoSemanalService {

    @Autowired
    private final OperacaoSemanalRepository operacaoSemanalRepository;

    public OperacaoSemanalService(OperacaoSemanalRepository operacaoSemanalRepository) {
        this.operacaoSemanalRepository = operacaoSemanalRepository;
    }

    public OperacaoSemanal salvarOperacaoSemanal(OperacaoSemanalRequest operacaoSemanal) {
        System.out.println("Dados recebidos: " + operacaoSemanal);

        OperacaoSemanal novaOperacaoSemanal = new OperacaoSemanal();

        novaOperacaoSemanal.setData(operacaoSemanal.data());
        novaOperacaoSemanal.setAno(operacaoSemanal.ano());
        novaOperacaoSemanal.setMes(operacaoSemanal.mes());
        novaOperacaoSemanal.setIdSubSistema(operacaoSemanal.idSubSistema());
        novaOperacaoSemanal.setSubSistema(operacaoSemanal.subSistema());
        novaOperacaoSemanal.setCustoMarginalOperacaoSemanal(operacaoSemanal.custoMarginalOperacaoSemanal());
        novaOperacaoSemanal.setCustoMarginalOperacaoSemanalCargaLeve(operacaoSemanal.custoMarginalOperacaoSemanalCargaLeve());
        novaOperacaoSemanal.setCustoMarginalOperacaoSemanalCargaMedia(operacaoSemanal.custoMarginalOperacaoSemanalCargaMedia());
        novaOperacaoSemanal.setCustoMarginalOperacaoSemanalCargaPesada(operacaoSemanal.custoMarginalOperacaoSemanalCargaPesada());
        return operacaoSemanalRepository.save(novaOperacaoSemanal);
    }

    public List<OperacaoSemanal> buscarTodasOperacoesSemanais() {
        return operacaoSemanalRepository.findAll();
    }

    public Optional<OperacaoSemanal> buscarOperacaoSemanalPorId(Long id) {
        return operacaoSemanalRepository.findById(id);
    }

    public OperacaoSemanal atualizarOperacaoSemanal(Long id, OperacaoSemanal operacaoSemanalAtualizada) {
        if (operacaoSemanalRepository.existsById(id)) {
            operacaoSemanalAtualizada.setId(id);
            return operacaoSemanalRepository.save(operacaoSemanalAtualizada);
        }
        return null; 
    }

    public void excluirOperacaoSemanal(Long id) {
        operacaoSemanalRepository.deleteById(id);
    }

    public void importarCSV(MultipartFile file) {
        try (InputStreamReader streamReader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVReader csvReader = new CSVReader(streamReader)) {

            List<OperacaoSemanal> lista = new ArrayList<>();
            String[] linha;
            boolean primeiraLinha = true;

            while ((linha = csvReader.readNext()) != null) {
                if (primeiraLinha) { 
                    primeiraLinha = false;
                    continue;
                }

                OperacaoSemanal custo = new OperacaoSemanal();
                custo.setData(linha[0]);
                custo.setAno(Integer.parseInt(linha[1]));
                custo.setMes(Integer.parseInt(linha[2]));
                custo.setIdSubSistema(linha[3]);
                custo.setSubSistema(linha[4]);
                custo.setCustoMarginalOperacaoSemanal((float) Double.parseDouble(linha[5]));
                custo.setCustoMarginalOperacaoSemanalCargaLeve((float) Double.parseDouble(linha[6]));
                custo.setCustoMarginalOperacaoSemanalCargaMedia((float) Double.parseDouble(linha[7]));
                custo.setCustoMarginalOperacaoSemanalCargaPesada((float) Double.parseDouble(linha[8]));
                lista.add(custo);
            }

            operacaoSemanalRepository.saveAll(lista);
        } catch (IOException | CsvValidationException e) {
            throw new RuntimeException("Erro ao processar o arquivo CSV", e);
        }
    }

}
