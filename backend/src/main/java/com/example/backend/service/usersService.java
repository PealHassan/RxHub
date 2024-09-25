package com.example.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.backend.entity.userEntity;
import com.example.backend.repository.usersRepository;

@Component
public class usersService {
    @Autowired
    private usersRepository usersRepo;

    public void saveEntry(userEntity user) {
        usersRepo.save(user);
    }

    public boolean isExist(userEntity user) {
        return usersRepo.findById(user.getUserid()).isPresent();
    }

    public userEntity findUserById(userEntity user) {
        return usersRepo.findById(user.getUserid()).orElse(null);
    }

    public List<userEntity> getUsers() {
        return usersRepo.findAll();
    }

    public void deleteUser(userEntity user) {
        usersRepo.delete(user);
    }
}
