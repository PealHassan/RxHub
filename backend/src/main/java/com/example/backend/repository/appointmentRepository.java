package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.entity.appointmentEntity;

public interface appointmentRepository extends MongoRepository<appointmentEntity, String> {

}
