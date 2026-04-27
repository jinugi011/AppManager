package com.example.appmanager;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class AppVersionTest {

    @Test
    void testGettersAndSetters() {
        AppVersion appVersion = new AppVersion();
        LocalDateTime now = LocalDateTime.now();

        appVersion.setId(1L);
        appVersion.setVersion("1.0.0");
        appVersion.setPlatform(AppVersion.Platform.ANDROID);
        appVersion.setFilePath("/path/to/file");
        appVersion.setIconPath("/path/to/icon");
        appVersion.setPlistPath("/path/to/plist");
        appVersion.setUploadDate(now);

        assertEquals(1L, appVersion.getId());
        assertEquals("1.0.0", appVersion.getVersion());
        assertEquals(AppVersion.Platform.ANDROID, appVersion.getPlatform());
        assertEquals("/path/to/file", appVersion.getFilePath());
        assertEquals("/path/to/icon", appVersion.getIconPath());
        assertEquals("/path/to/plist", appVersion.getPlistPath());
        assertEquals(now, appVersion.getUploadDate());
    }

    @Test
    void testPlatformEnum() {
        assertEquals(AppVersion.Platform.ANDROID, AppVersion.Platform.valueOf("ANDROID"));
        assertEquals(AppVersion.Platform.IOS, AppVersion.Platform.valueOf("IOS"));
    }
}