package com.igeos.backend.custoVariavel.dto.request;

public record CustoVariavelUnitarioRequest(
    String dataInicio,
    int ano,
    int mes,
    String dataFim,
    int anoPmo,
    int mesPmo,
    int numeroRevisao,
    String semanaOperativa,
    String idModeloUsina,
    String idSubSistema,
    String subSistema,
    String usina,
    float custoVariavelUnitario
){}
