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

import com.example.backend.entity.chamberEntitiy;

import com.example.backend.service.chambersService;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/chambers")
public class chambersController {
    @Autowired
    private chambersService chambersServ;

    @PostMapping("/add")
    public boolean add(@RequestBody chamberEntitiy chamber) {
        chambersServ.add(chamber);
        return true;
    }

    @GetMapping("/findChamberByUserid/{userid}")
    public List<chamberEntitiy> getChambersByUserid(@PathVariable String userid) {
        return chambersServ.findChambersByUserid(userid);
    }

    @GetMapping("/findChamberByChamberId/{chamberId}")
    public chamberEntitiy getChamberByChamberId(@PathVariable String chamberId) {
        return chambersServ.getChamberByChamberId(chamberId);
    }

    @PostMapping("/remove")
    public void remove(@RequestBody chamberEntitiy chamber) {
        chambersServ.remove(chamber);
    }

    @GetMapping("/getChambers")
    public List<chamberEntitiy> getChambers() {
        return chambersServ.getChambers();
    }
}
