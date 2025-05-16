package com.dynac.plantation.service;

import com.dynac.plantation.exception.ResourceNotFoundException;
import com.dynac.plantation.model.LearningMaterial;
import com.dynac.plantation.repository.LearningMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class LearningMaterialService {

    @Autowired
    private LearningMaterialRepository repository;

    public LearningMaterial createMaterial(LearningMaterial material) {
        material.setCreatedAt(LocalDateTime.now());
        material.setUpdatedAt(LocalDateTime.now());
        return repository.save(material);
    }

    public List<LearningMaterial> getAllMaterials() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public LearningMaterial updateMaterial(String id, LearningMaterial materialDetails) {
        LearningMaterial material = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found"));

        material.setTitle(materialDetails.getTitle());
        material.setDescription(materialDetails.getDescription());
        material.setFileUrl(materialDetails.getFileUrl());
        material.setFileType(materialDetails.getFileType());
        material.setUpdatedAt(LocalDateTime.now());

        return repository.save(material);
    }

    public void deleteMaterial(String id) {
        repository.deleteById(id);
    }
}
