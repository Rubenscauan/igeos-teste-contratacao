package com.igeos.backend.balancoEnergiaSubsistema.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.igeos.backend.balancoEnergiaSubsistema.dto.BalancoEnergiaSubsistemaRequest;
import com.igeos.backend.balancoEnergiaSubsistema.model.BalancoEnergiaSubsistema;
import com.igeos.backend.balancoEnergiaSubsistema.service.BalancoEnergiaSubsistemaService;

@RestController
@RequestMapping("/api/balanco-energia-subsistema")
public class BalancoEnergiaSubsistemaController {

    private final BalancoEnergiaSubsistemaService balancoEnergiaSubsistemaService;

    public BalancoEnergiaSubsistemaController(BalancoEnergiaSubsistemaService balancoEnergiaSubsistemaService) {
        this.balancoEnergiaSubsistemaService = balancoEnergiaSubsistemaService;
    }

    @GetMapping
    public List<BalancoEnergiaSubsistema> listarTodos() {
        return balancoEnergiaSubsistemaService.findAll();
    }

    @GetMapping("/{id}")
    public BalancoEnergiaSubsistema buscarPorId(@PathVariable Long id) {
        return balancoEnergiaSubsistemaService.findAll()
                      .stream()
                      .filter(b -> b.getId().equals(id))
                      .findFirst()
                      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro não encontrado"));
    }
    

    @PostMapping
    public void criarBalancoEnergia(@RequestBody BalancoEnergiaSubsistemaRequest balancoEnergiaDTO) {
        balancoEnergiaSubsistemaService.SalvarBalancoEnergia(balancoEnergiaDTO);
    }

    @PostMapping("/upload")
    public String uploadCSV(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return "O arquivo CSV está vazio!";
        }
        balancoEnergiaSubsistemaService.importarCSV(file);
        return "Arquivo importado com sucesso!";
    }

}
