package com.igeos.backend.custoVariavel.controller;

import com.igeos.backend.custoVariavel.dto.request.CustoVariavelUnitarioRequest;
import com.igeos.backend.custoVariavel.model.CustoVariavelUnitario;
import com.igeos.backend.custoVariavel.service.CustoVariavelUnitarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/custo-variavel")
public class CustoVariavelUnitarioController {
    private final CustoVariavelUnitarioService service;

    public CustoVariavelUnitarioController(CustoVariavelUnitarioService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CustoVariavelUnitario> criar(@RequestBody CustoVariavelUnitarioRequest custoVariavelUnitarioRequest) {
        CustoVariavelUnitario novoCusto = service.salvarCustoVariavelUnitario(custoVariavelUnitarioRequest);
        return ResponseEntity.ok(novoCusto);
    }

    @GetMapping
    public ResponseEntity<List<CustoVariavelUnitario>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustoVariavelUnitario> buscarPorId(@PathVariable Long id) {
        Optional<CustoVariavelUnitario> custo = service.buscarPorId(id);
        return custo.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload")
    public String uploadCSV(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return "O arquivo CSV está vazio!";
        }
        service.importarCSV(file);
        return "Arquivo importado com sucesso!";
    }
}
