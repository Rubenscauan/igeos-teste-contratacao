package com.igeos.backend.custoVariavel.model;


import java.time.LocalDate;

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
@Table(name = "custo_variavel_unitario")
public class CustoVariavelUnitario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String dataInicio;
    private int ano;
    private int mes;
    private String dataFim;
    private int anoPmo;
    private int mesPmo;
    private int numeroRevisao;
    private String semanaOperativa;
    private String idModeloUsina;
    private String idSubSistema;
    private String subSistema;
    private String usina;
    private float custoVariavelUnitario;

}
