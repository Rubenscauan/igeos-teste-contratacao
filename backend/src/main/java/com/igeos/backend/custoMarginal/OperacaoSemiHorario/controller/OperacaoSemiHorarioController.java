package com.igeos.backend.custoMarginal.OperacaoSemiHorario.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.igeos.backend.custoMarginal.OperacaoSemiHorario.dto.request.OperacaoSemiHorarioRequest;
import com.igeos.backend.custoMarginal.OperacaoSemiHorario.model.OperacaoSemiHorario;
import com.igeos.backend.custoMarginal.OperacaoSemiHorario.service.OperacaoSemiHorarioService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/operacao-semi-horario")  
public class OperacaoSemiHorarioController {

    @Autowired
    private final OperacaoSemiHorarioService operacaoSemiHorarioservice;

    public OperacaoSemiHorarioController(OperacaoSemiHorarioService operacaoSemiHorarioservice) {
        this.operacaoSemiHorarioservice = operacaoSemiHorarioservice;
    }

    @PostMapping
    public ResponseEntity<OperacaoSemiHorario> criar(@RequestBody OperacaoSemiHorarioRequest operacaoSemiHorarioRequest) {
        OperacaoSemiHorario novaOperacao = operacaoSemiHorarioservice.salvarOperacaoSemiHorario(operacaoSemiHorarioRequest);
        return ResponseEntity.ok(novaOperacao);
    }

    @GetMapping
    public ResponseEntity<List<OperacaoSemiHorario>> listarTodos() {
        return ResponseEntity.ok(operacaoSemiHorarioservice.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OperacaoSemiHorario> buscarPorId(@PathVariable Long id) {
        Optional<OperacaoSemiHorario> operacao = operacaoSemiHorarioservice.buscarPorId(id);
        return operacao.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        operacaoSemiHorarioservice.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload")
    public String uploadCSV(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return "O arquivo CSV está vazio!";
        }
        operacaoSemiHorarioservice.importarCSV(file);
        return "Arquivo importado com sucesso!";
    }
}
