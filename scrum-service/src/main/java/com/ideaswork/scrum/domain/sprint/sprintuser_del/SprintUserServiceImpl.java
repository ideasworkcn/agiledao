package com.ideaswork.scrum.domain.sprint.sprintuser_del;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SprintUserServiceImpl implements SprintUserService {
    private final SprintUserRepository sprintUserRepository;

    public SprintUserServiceImpl(SprintUserRepository sprintUserRepository) {
        this.sprintUserRepository = sprintUserRepository;
    }

    @Override
    public SprintUser save(SprintUser sprintUser) {
        return sprintUserRepository.save(sprintUser);
    }

    @Override
    public SprintUser findById(String sprintUserId) {
        return sprintUserRepository.findById(sprintUserId).orElse(null);
    }

    @Override
    public SprintUser update(SprintUser sprintUser) {
        return sprintUserRepository.save(sprintUser);
    }

    @Override
    public void delete(String sprintUserId) {
        sprintUserRepository.deleteById(sprintUserId);
    }

    @Override
    public List<SprintUser> findAll() {
        return sprintUserRepository.findAll();
    }
}
