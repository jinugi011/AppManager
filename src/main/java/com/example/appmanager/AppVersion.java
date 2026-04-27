package com.example.appmanager;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class AppVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String version;

    @Enumerated(EnumType.STRING)
    private Platform platform;

    private String filePath;

    private String iconPath;

    private String plistPath; // For iOS

    private LocalDateTime uploadDate;

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Platform getPlatform() {
        return platform;
    }

    public void setPlatform(Platform platform) {
        this.platform = platform;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getIconPath() {
        return iconPath;
    }

    public void setIconPath(String iconPath) {
        this.iconPath = iconPath;
    }

    public String getPlistPath() {
        return plistPath;
    }

    public void setPlistPath(String plistPath) {
        this.plistPath = plistPath;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    public enum Platform {
        ANDROID, IOS
    }
}