package com.example.appmanager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final AppService appService;

    @Autowired
    public ApiController(AppService appService) {
        this.appService = appService;
    }

    @GetMapping("/version")
    public AppVersion getLatestVersion(@RequestParam AppVersion.Platform platform) {
        return appService.getLatestVersion(platform);
    }
}