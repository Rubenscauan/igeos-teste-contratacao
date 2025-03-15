package com.igeos.backend.custoMarginal.operacaoSemanal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.igeos.backend.custoMarginal.operacaoSemanal.model.OperacaoSemanal;

@Repository
public interface OperacaoSemanalRepository extends JpaRepository<OperacaoSemanal, Long> {
    
}
