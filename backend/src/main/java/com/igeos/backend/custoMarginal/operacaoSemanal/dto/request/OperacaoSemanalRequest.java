package com.igeos.backend.custoMarginal.operacaoSemanal.dto.request;

public record OperacaoSemanalRequest(
    String data,
    int ano,
    int mes,
    String idSubSistema,
    String subSistema,
    float custoMarginalOperacaoSemanal,
    float custoMarginalOperacaoSemanalCargaLeve,
    float custoMarginalOperacaoSemanalCargaMedia,
    float custoMarginalOperacaoSemanalCargaPesada
){}
    