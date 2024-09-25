package com.example.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.backend.entity.chamberEntitiy;
import com.example.backend.repository.chambersRepository;

@Component
public class chambersService {
    @Autowired
    private chambersRepository chambersRepo;

    public void add(chamberEntitiy chamber) {
        chambersRepo.save(chamber);
    }

    public List<chamberEntitiy> findChambersByUserid(String userid) {
        return chambersRepo.findByUserid(userid);
    }

    public chamberEntitiy getChamberByChamberId(String chamberId) {
        return chambersRepo.findById(chamberId).orElse(null);
    }

    public void remove(chamberEntitiy chamber) {
        chambersRepo.delete(chamber);
    }

    public List<chamberEntitiy> getChambers() {
        return chambersRepo.findAll();
    }
}
