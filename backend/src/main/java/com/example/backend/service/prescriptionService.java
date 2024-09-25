package com.example.backend.service;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.backend.entity.prescriptionEntity;
import com.example.backend.repository.prescriptionRepository;

@Component
public class prescriptionService {
    @Autowired
    private prescriptionRepository presRepo;

    public void save(prescriptionEntity prescription) {
        presRepo.save(prescription);
    }

    public List<prescriptionEntity> getPrescriptionsByPatientId(String patientId) {
        List<prescriptionEntity> prescriptions = presRepo.findByPatientUserId(patientId);
        Collections.reverse(prescriptions);
        return prescriptions;
    }
}
