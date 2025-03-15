package com.igeos.backend.custoMarginal.operacaoSemanal.model;

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
@Table(name = "operacao_semanal")
public class OperacaoSemanal extends CMO{
    private float custoMarginalOperacaoSemanal;
    private float custoMarginalOperacaoSemanalCargaLeve;
    private float custoMarginalOperacaoSemanalCargaMedia;
    private float custoMarginalOperacaoSemanalCargaPesada;
}
