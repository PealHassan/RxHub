package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.backend.entity.appointmentEntity;
import com.example.backend.repository.appointmentRepository;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.AbstractMap.SimpleEntry;
import java.util.concurrent.TimeUnit;

@Component
public class appointmentService {
    @Autowired
    private appointmentRepository appointmentRepo;

    public void save(appointmentEntity appointment) {
        appointmentRepo.save(appointment);
    }

    public List<appointmentEntity> getAppointments() {
        List<appointmentEntity> appoints = appointmentRepo.findAll();
        return appoints;
    }

    public appointmentEntity getAppointmentById(String id) {
        return appointmentRepo.findById(id).orElse(null);
    }

    public Map<String, Map<String, Map<String, List<appointmentEntity>>>> getPatientsByDay() {
        List<appointmentEntity> appoints = appointmentRepo.findAll();

        // The outermost map is by date
        Map<String, Map<String, Map<String, List<appointmentEntity>>>> result = new HashMap<>();

        for (appointmentEntity appoint : appoints) {
            if (appoint.getStatus().equals("Scheduled")) {
                String date = appoint.getDate();
                String chamberId = appoint.getChamberid();
                String time = appoint.getTime();

                // Initialize the nested maps if necessary
                result.computeIfAbsent(date, d -> new HashMap<>())
                        .computeIfAbsent(chamberId, c -> new HashMap<>())
                        .computeIfAbsent(time, t -> new ArrayList<>())
                        .add(appoint);
            }
        }

        return result;
    }

    public List<appointmentEntity> getAppointmentsByUserId(String userid) {
        List<appointmentEntity> appoints = appointmentRepo.findAll();
        List<appointmentEntity> result = new ArrayList<>(); // Initialize the result list

        for (appointmentEntity appoint : appoints) {
            if (appoint.getPatientid().equals(userid)) { // Use .equals() to compare strings
                result.add(appoint);
            }
        }
        Collections.reverse(result);
        return result;
    }

    public Map<String, Map<String, Map<String, SimpleEntry<Integer, Integer>>>> getAvailibility() {
        List<appointmentEntity> appoints = appointmentRepo.findAll();
        Map<String, Map<String, Map<String, SimpleEntry<Integer, Integer>>>> result = new HashMap<>();
        SimpleDateFormat dateTimeFormat = new SimpleDateFormat("EEE MMM dd yyyy HH:mm");
        Date now = new Date();

        for (int i = 0; i < appoints.size(); i++) {
            appointmentEntity appoint = appoints.get(i);
            if (appoint.getStatus().equals("Scheduled")) {
                String timeRange = appoint.getTime();
                String date = appoint.getDate();
                try {
                    String[] times = timeRange.split(" - ");
                    String fullEndTime = date + " " + times[1];
                    Date endDateTime = dateTimeFormat.parse(fullEndTime);

                    long diffInMillis = now.getTime() - endDateTime.getTime();
                    long diffInHours = TimeUnit.MILLISECONDS.toHours(diffInMillis);
                    if (diffInHours >= 6) {
                        appoints.get(i).setStatus("Failed to Attend");
                        appointmentRepo.save(appoints.get(i));
                        continue;
                    }

                    // Chamber ID mapping
                    String chamberId = appoint.getChamberid();
                    result.putIfAbsent(chamberId, new HashMap<>());

                    // Date mapping
                    Map<String, Map<String, SimpleEntry<Integer, Integer>>> dateMap = result.get(chamberId);
                    dateMap.putIfAbsent(date, new HashMap<>());

                    // Time slot mapping
                    Map<String, SimpleEntry<Integer, Integer>> timeMap = dateMap.get(date);
                    SimpleEntry<Integer, Integer> currentEntry = timeMap.get(timeRange);

                    // If there is no entry for the timeRange, initialize with count 1 and sl_no
                    if (currentEntry == null) {
                        timeMap.put(timeRange, new SimpleEntry<>(1, appoint.getSl_no()));
                    } else {
                        // Update the count and check for the maximum sl_no
                        int updatedCount = currentEntry.getKey() + 1;
                        int maxSlNo = Math.max(currentEntry.getValue(), appoint.getSl_no());
                        timeMap.put(timeRange, new SimpleEntry<>(updatedCount, maxSlNo));
                    }

                } catch (ParseException e) {
                    e.printStackTrace();
                    // Handle parsing exceptions here
                }
            }
        }
        return result;
    }

}
