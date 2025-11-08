package com.example.demo.repository;

import com.example.demo.entity.PictureEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FilesRepository extends JpaRepository<PictureEntity, Long> {
}
