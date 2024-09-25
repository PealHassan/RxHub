package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.userEntity;
import com.example.backend.service.usersService;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/users")
public class usersController {
    @Autowired
    private usersService usersServ;

    @PostMapping("/isExist")
    public boolean isExist(@RequestBody userEntity user) {
        return usersServ.isExist(user);
    }

    @PostMapping("/registerUser")
    public boolean registerUser(@RequestBody userEntity user) {
        usersServ.saveEntry(user);
        return true;
    }

    @PostMapping("/findUserById")
    public userEntity findUserById(@RequestBody userEntity user) {
        return usersServ.findUserById(user);
    }

    @GetMapping("/getUsers")
    public List<userEntity> getUsers() {
        return usersServ.getUsers();
    }

    @PostMapping("/deleteUser")
    public void deleteUser(@RequestBody userEntity user) {
        usersServ.deleteUser(user);
    }
}
