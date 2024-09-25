package com.example.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend.entity.userEntity;

public interface usersRepository extends MongoRepository<userEntity, String> {

}
