package com.dynac.plantation.controller;

import com.dynac.plantation.model.LearningMaterial;
import com.dynac.plantation.service.LearningMaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/learning-materials")
@CrossOrigin(origins = "http://localhost:3002")
public class LearningMaterialController {

    @Autowired
    private LearningMaterialService service;

    @GetMapping
    public ResponseEntity<List<LearningMaterial>> getAllMaterials() {
        return new ResponseEntity<>(service.getAllMaterials(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<LearningMaterial> createMaterial(@RequestBody LearningMaterial material) {
        return new ResponseEntity<>(service.createMaterial(material), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningMaterial> updateMaterial(
            @PathVariable String id,
            @RequestBody LearningMaterial material) {
        return new ResponseEntity<>(service.updateMaterial(id, material), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable String id) {
        service.deleteMaterial(id);
        return ResponseEntity.noContent().build();
    }
}
