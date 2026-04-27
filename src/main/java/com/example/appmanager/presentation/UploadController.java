package com.example.appmanager.presentation;

import com.example.appmanager.application.AppService;
import com.example.appmanager.domain.AppVersion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/apps")
    @ResponseBody
    public ResponseEntity<List<AppVersion>> getApps() {
        List<AppVersion> versions = appService.getAllVersions();
        return ResponseEntity.ok(versions);
    }

    @GetMapping("/download/{id}")
    @ResponseBody
    public ResponseEntity<byte[]> downloadApp(@PathVariable Long id) {
        try {
            AppVersion appVersion = appService.getAppVersionById(id);
            byte[] fileContent = appService.downloadApp(id);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + appVersion.getFileName() + "\"")
                    .body(fileContent);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/apps/{id}")
    @ResponseBody
    public ResponseEntity<Void> deleteApp(@PathVariable Long id) {
        try {
            appService.deleteApp(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}