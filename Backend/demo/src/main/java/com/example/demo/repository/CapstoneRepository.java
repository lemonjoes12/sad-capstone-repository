package com.example.demo.repository;

import com.example.demo.entity.AdminEntity;
import com.example.demo.entity.CapstoneEntity;
import com.example.demo.entity.CategoryEntity;
import com.example.demo.enumerated.CapstoneStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CapstoneRepository extends JpaRepository<CapstoneEntity, Long> {

    List<CapstoneEntity> findAllByCategory(CategoryEntity category);



    List<CapstoneEntity> findByCategoryAndCapstoneStatus(CategoryEntity category, CapstoneStatus status);
}
