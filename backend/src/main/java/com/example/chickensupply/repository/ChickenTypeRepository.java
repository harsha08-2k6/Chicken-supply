package com.example.chickensupply.repository;

import com.example.chickensupply.entity.ChickenType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChickenTypeRepository extends JpaRepository<ChickenType, Long> {
    Optional<ChickenType> findByName(String name);
}
