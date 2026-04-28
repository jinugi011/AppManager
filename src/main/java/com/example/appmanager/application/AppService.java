package com.example.appmanager.application;

import com.example.appmanager.domain.AppVersion;
import com.example.appmanager.infrastructure.AppVersionRepository;
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

    private final Path aosUploadDir = Paths.get("upload/aos");
    private final Path iosUploadDir = Paths.get("upload/ios");

    public AppService(AppVersionRepository repository) {
        this.repository = repository;
        try {
            Files.createDirectories(aosUploadDir);
            Files.createDirectories(iosUploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directories", e);
        }
    }

    public AppVersion uploadApp(String version, AppVersion.Platform platform, MultipartFile appFile, MultipartFile iconFile, MultipartFile plistFile) throws IOException {
        AppVersion appVersion = new AppVersion();
        appVersion.setVersion(version);
        appVersion.setPlatform(platform);
        appVersion.setUploadDate(LocalDateTime.now());

        Path platformDir = (platform == AppVersion.Platform.IOS) ? iosUploadDir : aosUploadDir;

        // Save app file
        String appFileName = appFile.getOriginalFilename();
        Path appPath = platformDir.resolve(appFileName);
        Files.copy(appFile.getInputStream(), appPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        appVersion.setFileName(appFileName);
        appVersion.setFilePath(appPath.toString());

        // Save icon file
        if (iconFile != null && !iconFile.isEmpty()) {
            String iconFileName = iconFile.getOriginalFilename();
            Path iconPath = platformDir.resolve(iconFileName);
            Files.copy(iconFile.getInputStream(), iconPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            appVersion.setIconPath(iconPath.toString());
        }

        // Save plist file for iOS
        if (platform == AppVersion.Platform.IOS && plistFile != null && !plistFile.isEmpty()) {
            String plistFileName = plistFile.getOriginalFilename();
            Path plistPath = iosUploadDir.resolve(plistFileName);
            Files.copy(plistFile.getInputStream(), plistPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
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

    public AppVersion getAppVersionById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("App version not found"));
    }

    public byte[] downloadApp(Long id) throws IOException {
        AppVersion appVersion = getAppVersionById(id);
        Path filePath = Paths.get(appVersion.getFilePath());
        return Files.readAllBytes(filePath);
    }

    public void deleteApp(Long id) {
        AppVersion appVersion = getAppVersionById(id);
        // Delete file from filesystem
        try {
            Files.deleteIfExists(Paths.get(appVersion.getFilePath()));
            if (appVersion.getIconPath() != null) {
                Files.deleteIfExists(Paths.get(appVersion.getIconPath()));
            }
            if (appVersion.getPlistPath() != null) {
                Files.deleteIfExists(Paths.get(appVersion.getPlistPath()));
            }
        } catch (IOException e) {
            // Log error but continue with DB deletion
            System.err.println("Error deleting files: " + e.getMessage());
        }
        repository.deleteById(id);
    }
}