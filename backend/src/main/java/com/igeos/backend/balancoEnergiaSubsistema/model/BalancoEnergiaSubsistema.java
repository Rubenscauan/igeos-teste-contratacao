package com.igeos.backend.balancoEnergiaSubsistema.model;

import java.sql.Date;
import java.sql.Time;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "balanco_energia_subsistema")
public class BalancoEnergiaSubsistema{


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String data;
    private String hora;
    private int ano;
    private int mes;
    private String idSubsistema;
    private String subsistema;
    private float valorDemanda;
    private float usinaHidraulicaVerificada;
    private float geracaoPequenaUsinaHidraulicaVerificada;
    private float geracaoUsinaTermicaVerificada;
    private float geracaoPequenaUsinaTermicaVerificada;
    private float geracaoEolicaVerificada;
    private float geracaoFotovoltaicaVerificada;
}