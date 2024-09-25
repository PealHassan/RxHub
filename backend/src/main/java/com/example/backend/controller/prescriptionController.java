package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.prescriptionEntity;
import com.example.backend.service.prescriptionService;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/prescriptions")
public class prescriptionController {
    @Autowired
    private prescriptionService presServ;

    @PostMapping("/addPrescription")
    public void save(@RequestBody prescriptionEntity prescription) {
        presServ.save(prescription);
    }

    @GetMapping("/getPrescriptions/{patientId}")
    public List<prescriptionEntity> getPrescriptionsByPatientId(@PathVariable String patientId) {
        return presServ.getPrescriptionsByPatientId(patientId);
    }
}
