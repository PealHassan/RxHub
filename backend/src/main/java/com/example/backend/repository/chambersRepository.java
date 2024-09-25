package com.example.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.entity.chamberEntitiy;

@Repository
public interface chambersRepository extends MongoRepository<chamberEntitiy, String> {
    List<chamberEntitiy> findByUserid(String userid);
}
