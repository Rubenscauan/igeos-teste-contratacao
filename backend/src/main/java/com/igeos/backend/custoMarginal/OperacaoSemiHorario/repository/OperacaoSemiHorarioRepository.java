package com.igeos.backend.custoMarginal.OperacaoSemiHorario.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.igeos.backend.custoMarginal.OperacaoSemiHorario.model.OperacaoSemiHorario;

@Repository
public interface OperacaoSemiHorarioRepository extends JpaRepository<OperacaoSemiHorario, Long> {
}
