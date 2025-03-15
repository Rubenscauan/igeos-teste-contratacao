package com.igeos.backend.custoMarginal.OperacaoSemiHorario.dto.request;

public record OperacaoSemiHorarioRequest(
    String data,
    int ano,
    int mes,
    String idSubSistema,
    String subSistema,
    String hora,
    float custoMarginalOperacao
){}
    

