package com.example.backend.controller;

import java.util.AbstractMap.SimpleEntry;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.appointmentEntity;
import com.example.backend.service.appointmentService;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/appointments")
public class appointmentController {
    @Autowired
    private appointmentService appointmentServ;

    @PostMapping("/createAppointment")
    public void save(@RequestBody appointmentEntity appoint) {
        appointmentServ.save(appoint);
    }

    @GetMapping("/getAvailibility")
    public Map<String, Map<String, Map<String, SimpleEntry<Integer, Integer>>>> getAvailibility() {
        return appointmentServ.getAvailibility();
    }

    @GetMapping("/{userid}")
    public List<appointmentEntity> getAppointmentsByUserId(@PathVariable String userid) {
        return appointmentServ.getAppointmentsByUserId(userid);
    }

    @GetMapping("/getAppointmentById/{id}")
    public appointmentEntity getApppointById(@PathVariable String id) {
        return appointmentServ.getAppointmentById(id);
    }

    @GetMapping("/getPatientListByDay")
    public Map<String, Map<String, Map<String, List<appointmentEntity>>>> getPatientListByDay() {
        return appointmentServ.getPatientsByDay();
    }

    @GetMapping("/getAppointments")
    public List<appointmentEntity> getAppointments() {
        return appointmentServ.getAppointments();
    }

}
