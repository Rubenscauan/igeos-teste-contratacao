package com.igeos.backend.custoMarginal.OperacaoSemiHorario.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.igeos.backend.custoMarginal.OperacaoSemiHorario.dto.request.OperacaoSemiHorarioRequest;
import com.igeos.backend.custoMarginal.OperacaoSemiHorario.model.OperacaoSemiHorario;
import com.igeos.backend.custoMarginal.OperacaoSemiHorario.repository.OperacaoSemiHorarioRepository;
import com.igeos.backend.custoMarginal.operacaoSemanal.dto.request.OperacaoSemanalRequest;
import com.igeos.backend.custoMarginal.operacaoSemanal.model.OperacaoSemanal;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OperacaoSemiHorarioService {

    @Autowired
    private final OperacaoSemiHorarioRepository operacaoSemiHorarioRepository;

    public OperacaoSemiHorarioService(OperacaoSemiHorarioRepository operacaoSemiHorarioRepository) {
        this.operacaoSemiHorarioRepository = operacaoSemiHorarioRepository;
    }

    public OperacaoSemiHorario salvarOperacaoSemiHorario(OperacaoSemiHorarioRequest OperacaoSemiHorario) {
        System.out.println("Dados recebidos: " + OperacaoSemiHorario);

        OperacaoSemiHorario novaOperacaoSemiHorario = new OperacaoSemiHorario();

        novaOperacaoSemiHorario.setData(OperacaoSemiHorario.data());
        novaOperacaoSemiHorario.setAno(OperacaoSemiHorario.ano());
        novaOperacaoSemiHorario.setMes(OperacaoSemiHorario.mes());
        novaOperacaoSemiHorario.setIdSubSistema(OperacaoSemiHorario.idSubSistema());
        novaOperacaoSemiHorario.setSubSistema(OperacaoSemiHorario.subSistema());
        novaOperacaoSemiHorario.setHora(OperacaoSemiHorario.hora());
        novaOperacaoSemiHorario.setCustoMarginalOperacao(OperacaoSemiHorario.custoMarginalOperacao());

        return operacaoSemiHorarioRepository.save(novaOperacaoSemiHorario);
        
    }


    public List<OperacaoSemiHorario> listarTodos() {
        return operacaoSemiHorarioRepository.findAll();
    }

    public Optional<OperacaoSemiHorario> buscarPorId(Long id) {
        return operacaoSemiHorarioRepository.findById(id);
    }

    public void deletar(Long id) {
        operacaoSemiHorarioRepository.deleteById(id);
    }

    public void importarCSV(MultipartFile file) {
        try (InputStreamReader streamReader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVReader csvReader = new CSVReader(streamReader)) {
    
            List<OperacaoSemiHorario> lista = new ArrayList<>();
            String[] linha;
            boolean primeiraLinha = true;
    
            while ((linha = csvReader.readNext()) != null) {
                if (primeiraLinha) { 
                    primeiraLinha = false;
                    continue;
                }
    
                try {
                    OperacaoSemiHorario custo = new OperacaoSemiHorario();
                    custo.setData(linha[0]);
                    custo.setHora(linha[1]);
                    custo.setAno(Integer.parseInt(linha[2]));
                    custo.setMes(Integer.parseInt(linha[3]));
                    custo.setIdSubSistema(linha[4]);
                    custo.setSubSistema(linha[5]);
                    custo.setCustoMarginalOperacao(Float.parseFloat(linha[6]));
    
                    lista.add(custo);
                } catch (Exception e) {
                    System.err.println("Erro ao processar linha: " + String.join(",", linha));
                    e.printStackTrace();
                }
            }
    
            operacaoSemiHorarioRepository.saveAll(lista);
            System.out.println("Importação concluída. Registros salvos: " + lista.size());
        } catch (IOException | CsvValidationException e) {
            System.err.println("Erro ao processar o arquivo CSV: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao processar o arquivo CSV", e);
        }
    }
    
}
