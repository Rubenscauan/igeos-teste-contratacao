package com.igeos.backend.custoMarginal.operacaoSemanal.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.igeos.backend.balancoEnergiaSubsistema.dto.BalancoEnergiaSubsistemaRequest;
import com.igeos.backend.custoMarginal.operacaoSemanal.dto.request.OperacaoSemanalRequest;
import com.igeos.backend.custoMarginal.operacaoSemanal.model.OperacaoSemanal;
import com.igeos.backend.custoMarginal.operacaoSemanal.service.OperacaoSemanalService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/operacao-semanal")
public class OperacaoSemanalController {

    @Autowired
    private final OperacaoSemanalService operacaoSemanalService;

    public OperacaoSemanalController(OperacaoSemanalService operacaoSemanalService) {
        this.operacaoSemanalService = operacaoSemanalService;
    }

    @PostMapping
    public ResponseEntity<OperacaoSemanal> criarOperacaoSemanal(@RequestBody OperacaoSemanalRequest operacaoSemanalDTO) {
        OperacaoSemanal operacaoSemanalSalva = operacaoSemanalService.salvarOperacaoSemanal(operacaoSemanalDTO);
        return ResponseEntity.ok(operacaoSemanalSalva);
    }

    @GetMapping
    public ResponseEntity<List<OperacaoSemanal>> listarOperacoesSemanais() {
        List<OperacaoSemanal> operacoesSemanais = operacaoSemanalService.buscarTodasOperacoesSemanais();
        return ResponseEntity.ok(operacoesSemanais);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OperacaoSemanal> buscarOperacaoSemanalPorId(@PathVariable Long id) {
        Optional<OperacaoSemanal> operacaoSemanal = operacaoSemanalService.buscarOperacaoSemanalPorId(id);
        return operacaoSemanal.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<OperacaoSemanal> atualizarOperacaoSemanal(
            @PathVariable Long id, @RequestBody OperacaoSemanal operacaoSemanal) {
        OperacaoSemanal operacaoSemanalAtualizada = operacaoSemanalService.atualizarOperacaoSemanal(id, operacaoSemanal);
        return operacaoSemanalAtualizada != null
                ? ResponseEntity.ok(operacaoSemanalAtualizada)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluirOperacaoSemanal(@PathVariable Long id) {
        operacaoSemanalService.excluirOperacaoSemanal(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload")
    public String uploadCSV(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return "O arquivo CSV está vazio!";
        }
        operacaoSemanalService.importarCSV(file);
        return "Arquivo importado com sucesso!";
    }
}
