package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.prescriptionEntity;

@Repository
public interface prescriptionRepository extends MongoRepository<prescriptionEntity, String> {
    List<prescriptionEntity> findByPatientUserId(String patientUserId);
}
