package com.example.appmanager.infrastructure;

import com.example.appmanager.domain.AppVersion;
import com.example.appmanager.infrastructure.AppVersionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import java.time.LocalDateTime;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class AppVersionRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private AppVersionRepository repository;

    @Test
    void testFindByPlatform() {
        AppVersion appVersion = new AppVersion();
        appVersion.setVersion("1.0.0");
        appVersion.setPlatform(AppVersion.Platform.ANDROID);
        appVersion.setUploadDate(LocalDateTime.now());
        entityManager.persist(appVersion);

        List<AppVersion> result = repository.findByPlatform(AppVersion.Platform.ANDROID);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getVersion()).isEqualTo("1.0.0");
    }

    @Test
    void testFindTopByPlatformOrderByUploadDateDesc() {
        LocalDateTime now = LocalDateTime.now();
        AppVersion app1 = new AppVersion();
        app1.setVersion("1.0.0");
        app1.setPlatform(AppVersion.Platform.ANDROID);
        app1.setUploadDate(now.minusDays(1));
        entityManager.persist(app1);

        AppVersion app2 = new AppVersion();
        app2.setVersion("1.1.0");
        app2.setPlatform(AppVersion.Platform.ANDROID);
        app2.setUploadDate(now);
        entityManager.persist(app2);

        AppVersion result = repository.findTopByPlatformOrderByUploadDateDesc(AppVersion.Platform.ANDROID);

        assertThat(result.getVersion()).isEqualTo("1.1.0");
    }
}