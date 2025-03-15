package com.igeos.backend.custoVariavel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.igeos.backend.custoVariavel.model.CustoVariavelUnitario;

@Repository
public interface CustoVariavelUnitarioRepository extends JpaRepository<CustoVariavelUnitario, Long> {
}