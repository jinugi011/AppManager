package com.example.appmanager.presentation;

import com.example.appmanager.application.AppService;
import com.example.appmanager.domain.AppVersion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Controller
@RequestMapping("/download")
public class DownloadController {

    private final AppService appService;

    @Autowired
    public DownloadController(AppService appService) {
        this.appService = appService;
    }

    @GetMapping
    public String downloadPage(Model model) {
        List<AppVersion> versions = appService.getAllVersions();
        model.addAttribute("versions", versions);
        return "download";
    }

    @GetMapping("/app/{id}")
    public ResponseEntity<Resource> downloadApp(@PathVariable Long id) throws MalformedURLException {
        AppVersion appVersion = appService.getAllVersions().stream()
                .filter(v -> v.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("App not found"));

        Path filePath = Paths.get(appVersion.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.getFileName() + "\"")
                .body(resource);
    }

    @GetMapping("/icon/{id}")
    public ResponseEntity<Resource> downloadIcon(@PathVariable Long id) throws MalformedURLException {
        AppVersion appVersion = appService.getAllVersions().stream()
                .filter(v -> v.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("App not found"));

        Path filePath = Paths.get(appVersion.getIconPath());
        Resource resource = new UrlResource(filePath.toUri());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.getFileName() + "\"")
                .body(resource);
    }
}