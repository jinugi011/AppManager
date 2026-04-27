package com.example.appmanager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/upload")
public class UploadController {

    private final AppService appService;

    @Autowired
    public UploadController(AppService appService) {
        this.appService = appService;
    }

    @GetMapping
    public String uploadForm(Model model) {
        List<AppVersion> versions = appService.getAllVersions();
        model.addAttribute("versions", versions);
        return "upload";
    }

    @PostMapping
    public String uploadApp(@RequestParam String version,
                            @RequestParam AppVersion.Platform platform,
                            @RequestParam("appFile") MultipartFile appFile,
                            @RequestParam(value = "iconFile", required = false) MultipartFile iconFile,
                            @RequestParam(value = "plistFile", required = false) MultipartFile plistFile,
                            Model model) {
        try {
            appService.uploadApp(version, platform, appFile, iconFile, plistFile);
            model.addAttribute("message", "Upload successful");
        } catch (IOException e) {
            model.addAttribute("message", "Upload failed: " + e.getMessage());
        }
        return "redirect:/upload";
    }
}