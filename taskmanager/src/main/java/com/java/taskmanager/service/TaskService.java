package com.java.taskmanager.service;

import com.java.taskmanager.entity.TaskEntity;
import com.java.taskmanager.repository.TodoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TaskService {
    private final TodoRepository todoRepository;

    public TaskService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    public List<TaskEntity> getAll(){
        return todoRepository.findAll();
    }

    public TaskEntity getById(Long id){
        return todoRepository.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found with id " + id));
    }

    public List<TaskEntity> getByStatus(boolean completed){
        return todoRepository.findByCompleted(completed);
    }

    public TaskEntity create(TaskEntity task){
        //task.setId(null);
        return todoRepository.save(task);
    }

    public TaskEntity update(Long id, TaskEntity updated){
        TaskEntity existing = getById(id);
        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setCompleted(updated.isCompleted());

        return todoRepository.save(existing);
    }

    public TaskEntity toggle(Long id){
        TaskEntity task = getById(id);
        task.setCompleted(!task.isCompleted());
        return todoRepository.save(task);
    }

    public void delete(Long id){
        getById(id);
        todoRepository.deleteById(id);
    }
}
