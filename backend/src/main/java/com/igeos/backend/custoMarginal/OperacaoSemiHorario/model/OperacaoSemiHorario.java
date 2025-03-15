package com.igeos.backend.custoMarginal.OperacaoSemiHorario.model;

import com.igeos.backend.custoMarginal.CMO;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "operacao_semi_horario")
public class OperacaoSemiHorario extends CMO {
    private String hora;
    private float custoMarginalOperacao;
}
