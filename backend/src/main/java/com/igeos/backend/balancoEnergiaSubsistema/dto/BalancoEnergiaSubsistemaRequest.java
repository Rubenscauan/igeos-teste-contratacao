package com.igeos.backend.balancoEnergiaSubsistema.dto;

public record BalancoEnergiaSubsistemaRequest(
    String data,
    String hora,
    int ano,
    int mes,
    String idSubsistema,
    String subsistema,
    float valorDemanda,
    float usinaHidraulicaVerificada,
    float geracaoPequenaUsinaHidraulicaVerificada,
    float geracaoUsinaTermicaVerificada,
    float geracaoPequenaUsinaTermicaVerificada,
    float geracaoEolicaVerificada,
    float geracaoFotovoltaicaVerificada
) {}


