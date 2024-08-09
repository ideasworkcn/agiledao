package com.ideaswork.scrum.domain.sprint.sprintuser_del;

import java.util.List;

public interface SprintUserService {
    SprintUser save(SprintUser sprintUser);
    SprintUser findById(String sprintUserId);
    SprintUser update(SprintUser sprintUser);
    void delete(String sprintUserId);
    List<SprintUser> findAll();
}
