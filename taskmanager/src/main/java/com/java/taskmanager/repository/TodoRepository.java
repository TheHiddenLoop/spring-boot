package com.java.taskmanager.repository;

import com.java.taskmanager.entity.TaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TodoRepository extends JpaRepository<TaskEntity, Long> {
    List<TaskEntity> findByCompleted(boolean completed);

    void deleteById(Long id);
}
