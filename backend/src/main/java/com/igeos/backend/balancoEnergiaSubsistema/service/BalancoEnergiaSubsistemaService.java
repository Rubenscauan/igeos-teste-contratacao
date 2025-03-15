package com.igeos.backend.balancoEnergiaSubsistema.service;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.igeos.backend.balancoEnergiaSubsistema.dto.BalancoEnergiaSubsistemaRequest;
import com.igeos.backend.balancoEnergiaSubsistema.model.BalancoEnergiaSubsistema;
import com.igeos.backend.balancoEnergiaSubsistema.repository.BalancoEnergiaSubsistemaRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;

@Service
public class BalancoEnergiaSubsistemaService {
    private final BalancoEnergiaSubsistemaRepository balancoEnergiaSubsistemaRepository;

    public BalancoEnergiaSubsistemaService(BalancoEnergiaSubsistemaRepository balancoEnergiaSubsistemaRepository) {
        this.balancoEnergiaSubsistemaRepository = balancoEnergiaSubsistemaRepository;
    }

    public List<BalancoEnergiaSubsistema> findAll() {
        return balancoEnergiaSubsistemaRepository.findAll();
    }
    
    public void SalvarBalancoEnergia(BalancoEnergiaSubsistemaRequest balancoEnergiaDTO) {
        System.out.println("Dados recebidos: " + balancoEnergiaDTO);

        BalancoEnergiaSubsistema balancoNovo = new BalancoEnergiaSubsistema();

        balancoNovo.setData(balancoEnergiaDTO.data());
        balancoNovo.setHora(balancoEnergiaDTO.hora());
        balancoNovo.setAno((int) balancoEnergiaDTO.ano()); 
        balancoNovo.setMes((int) balancoEnergiaDTO.mes()); 
        balancoNovo.setIdSubsistema(balancoEnergiaDTO.idSubsistema());
        balancoNovo.setSubsistema(balancoEnergiaDTO.subsistema());
        balancoNovo.setValorDemanda((float) balancoEnergiaDTO.valorDemanda());
        balancoNovo.setUsinaHidraulicaVerificada((float) balancoEnergiaDTO.usinaHidraulicaVerificada());
        balancoNovo.setGeracaoPequenaUsinaHidraulicaVerificada((float) balancoEnergiaDTO.geracaoPequenaUsinaHidraulicaVerificada());
        balancoNovo.setGeracaoUsinaTermicaVerificada((float) balancoEnergiaDTO.geracaoUsinaTermicaVerificada());
        balancoNovo.setGeracaoPequenaUsinaTermicaVerificada((float) balancoEnergiaDTO.geracaoPequenaUsinaTermicaVerificada());
        balancoNovo.setGeracaoEolicaVerificada((float) balancoEnergiaDTO.geracaoEolicaVerificada());
        balancoNovo.setGeracaoFotovoltaicaVerificada((float) balancoEnergiaDTO.geracaoFotovoltaicaVerificada());

        balancoEnergiaSubsistemaRepository.save(balancoNovo);
        
    }

    public void importarCSV(MultipartFile file) {
        try (InputStreamReader streamReader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVReader csvReader = new CSVReader(streamReader)) {

            List<BalancoEnergiaSubsistema> lista = new ArrayList<>();
            String[] linha;
            boolean primeiraLinha = true;

            while ((linha = csvReader.readNext()) != null) {
                if (primeiraLinha) { 
                    primeiraLinha = false;
                    continue;
                }
                BalancoEnergiaSubsistema custo = new BalancoEnergiaSubsistema();
                custo.setData(linha[0]);
                custo.setHora(linha[1]);    
                custo.setAno((int) Double.parseDouble(linha[2]));
                custo.setMes((int) Double.parseDouble(linha[3]));                
                custo.setIdSubsistema(linha[4]);
                custo.setSubsistema(linha[5]);
                custo.setValorDemanda((float) Double.parseDouble(linha[6]));
                custo.setUsinaHidraulicaVerificada((float) Double.parseDouble(linha[7]));
                custo.setGeracaoPequenaUsinaHidraulicaVerificada((float) Double.parseDouble(linha[8]));
                custo.setGeracaoUsinaTermicaVerificada((float) Double.parseDouble(linha[9]));
                custo.setGeracaoPequenaUsinaTermicaVerificada((float) Double.parseDouble(linha[10]));
                custo.setGeracaoEolicaVerificada((float) Double.parseDouble(linha[11]));
                custo.setGeracaoFotovoltaicaVerificada((float) Double.parseDouble(linha[12]));
                lista.add(custo);
            }

            balancoEnergiaSubsistemaRepository.saveAll(lista);
        } catch (IOException | CsvValidationException e) {
            throw new RuntimeException("Erro ao processar o arquivo CSV", e);
        }
    }

}
