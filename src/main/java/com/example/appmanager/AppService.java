package com.example.appmanager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppService {

    private final AppVersionRepository repository;

    private final Path uploadDir = Paths.get("uploads");

    @Autowired
    public AppService(AppVersionRepository repository) {
        this.repository = repository;
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public AppVersion uploadApp(String version, AppVersion.Platform platform, MultipartFile appFile, MultipartFile iconFile, MultipartFile plistFile) throws IOException {
        AppVersion appVersion = new AppVersion();
        appVersion.setVersion(version);
        appVersion.setPlatform(platform);
        appVersion.setUploadDate(LocalDateTime.now());

        // Save app file
        String appFileName = appFile.getOriginalFilename();
        Path appPath = uploadDir.resolve(appFileName);
        Files.copy(appFile.getInputStream(), appPath);
        appVersion.setFilePath(appPath.toString());

        // Save icon file
        if (iconFile != null && !iconFile.isEmpty()) {
            String iconFileName = iconFile.getOriginalFilename();
            Path iconPath = uploadDir.resolve(iconFileName);
            Files.copy(iconFile.getInputStream(), iconPath);
            appVersion.setIconPath(iconPath.toString());
        }

        // Save plist file for iOS
        if (platform == AppVersion.Platform.IOS && plistFile != null && !plistFile.isEmpty()) {
            String plistFileName = plistFile.getOriginalFilename();
            Path plistPath = uploadDir.resolve(plistFileName);
            Files.copy(plistFile.getInputStream(), plistPath);
            appVersion.setPlistPath(plistPath.toString());
        }

        return repository.save(appVersion);
    }

    public List<AppVersion> getAllVersions() {
        return repository.findAll();
    }

    public AppVersion getLatestVersion(AppVersion.Platform platform) {
        return repository.findTopByPlatformOrderByUploadDateDesc(platform);
    }
}