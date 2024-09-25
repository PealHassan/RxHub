package com.example.backend.entity;

import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "prescriptions")
public class prescriptionEntity {
    @Id
    private String id;
    private String appointmentId;
    private String doctorName;
    private String doctorUserId;
    private List<String> doctorDegrees;
    private List<String> doctorCategories;
    private String chamberId;
    private String chamberAddress;
    private String time;
    private String serialNo;
    private String patientName;
    private String patientUserId;
    private String address;
    private String age;
    private String sex;
    private String diagnosis;
    private String advice;
    private List<Map<String, String>> medicines;

    private String date;

    public List<Map<String, String>> getMedicines() {
        return medicines;
    }

    public void setMedicines(List<Map<String, String>> medicines) {
        this.medicines = medicines;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAdvice() {
        return advice;
    }

    public void setAdvice(String advice) {
        this.advice = advice;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public String getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(String appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getChamberAddress() {
        return chamberAddress;
    }

    public void setChamberAddress(String chamberAddress) {
        this.chamberAddress = chamberAddress;
    }

    public String getChamberId() {
        return chamberId;
    }

    public void setChamberId(String chamberId) {
        this.chamberId = chamberId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public List<String> getDoctorCategories() {
        return doctorCategories;
    }

    public void setDoctorCategories(List<String> doctorCategories) {
        this.doctorCategories = doctorCategories;
    }

    public List<String> getDoctorDegrees() {
        return doctorDegrees;
    }

    public void setDoctorDegrees(List<String> doctorDegrees) {
        this.doctorDegrees = doctorDegrees;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getDoctorUserId() {
        return doctorUserId;
    }

    public void setDoctorUserId(String doctorUserId) {
        this.doctorUserId = doctorUserId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientUserId() {
        return patientUserId;
    }

    public void setPatientUserId(String patientUserId) {
        this.patientUserId = patientUserId;
    }

    public String getSerialNo() {
        return serialNo;
    }

    public void setSerialNo(String serialNo) {
        this.serialNo = serialNo;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }
}
