package com.java.taskmanager.controller;

import com.java.taskmanager.entity.TaskEntity;
import com.java.taskmanager.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task")
@CrossOrigin
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskEntity> getAll(@RequestParam(required = false) Boolean completed){
        return completed == null ? taskService.getAll() : taskService.getByStatus(completed);
    }

    @GetMapping("/{id}")
    public TaskEntity getById(@PathVariable Long id){
        return taskService.getById(id);
    }

    @PostMapping
    public ResponseEntity<TaskEntity> create(@RequestBody TaskEntity task){
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.create(task));
    }

    @PutMapping("/{id}")
    public TaskEntity update(@PathVariable Long id, @RequestBody TaskEntity task) {
        return taskService.update(id, task);
    }

    @PatchMapping("/{id}/toggle")
    public TaskEntity toggle(@PathVariable Long id) {
        return taskService.toggle(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
