package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Schedule;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Schedule entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    @Query("select schedule from Schedule schedule where schedule.user.login = ?#{principal.username}")
    List<Schedule> findByUserIsCurrentUser();
}
