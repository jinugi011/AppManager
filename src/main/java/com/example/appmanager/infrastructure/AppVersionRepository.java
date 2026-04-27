package com.example.appmanager.infrastructure;

import com.example.appmanager.domain.AppVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppVersionRepository extends JpaRepository<AppVersion, Long> {

    List<AppVersion> findByPlatform(AppVersion.Platform platform);

    AppVersion findTopByPlatformOrderByUploadDateDesc(AppVersion.Platform platform);
}