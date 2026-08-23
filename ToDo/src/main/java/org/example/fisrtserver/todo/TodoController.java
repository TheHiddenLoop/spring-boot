package org.example.fisrtserver.todo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


class Todo {

    private int id;
    private String title;
    private String description;
    private boolean status;

    public Todo(int id, String title, String description, boolean status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public boolean isStatus() {
        return status;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}



class TodoRequest {

    private int id;
    private String title;
    private String description;
    private boolean status;

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public boolean isStatus() {
        return status;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}


@RestController
@RequestMapping("/todos")
public class TodoController {

    private final List<Todo> todos = new ArrayList<>();

    @PostMapping
    public ResponseEntity<Todo> createTodo(
            @RequestBody TodoRequest request
    ) {

        validateTodo(request);

        // Check duplicate ID
        for (Todo todo : todos) {
            if (todo.getId() == request.getId()) {
                throw new IllegalArgumentException(
                        "Todo with this ID already exists"
                );
            }
        }

        Todo todo = new Todo(
                request.getId(),
                request.getTitle(),
                request.getDescription(),
                request.isStatus()
        );

        todos.add(todo);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(todo);
    }



    @GetMapping
    public ResponseEntity<List<Todo>> getAllTodos() {

        return ResponseEntity.ok(todos);
    }



    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(
            @PathVariable int id
    ) {

        Todo todo = findTodoById(id);

        return ResponseEntity.ok(todo);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(
            @PathVariable int id,
            @RequestBody TodoRequest request
    ) {

        Todo todo = findTodoById(id);

        if (request.getTitle() == null ||
                request.getTitle().isBlank()) {

            throw new IllegalArgumentException(
                    "Title is required"
            );
        }

        if (request.getDescription() == null ||
                request.getDescription().isBlank()) {

            throw new IllegalArgumentException(
                    "Description is required"
            );
        }

        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setStatus(request.isStatus());

        return ResponseEntity.ok(todo);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(
            @PathVariable int id
    ) {

        Todo todo = findTodoById(id);

        todos.remove(todo);

        return ResponseEntity.noContent().build();
    }


    private void validateTodo(TodoRequest request) {

        if (request.getTitle() == null ||
                request.getTitle().isBlank()) {

            throw new IllegalArgumentException(
                    "Title is required"
            );
        }

        if (request.getDescription() == null ||
                request.getDescription().isBlank()) {

            throw new IllegalArgumentException(
                    "Description is required"
            );
        }
    }

    private Todo findTodoById(int id) {

        for (Todo todo : todos) {

            if (todo.getId() == id) {
                return todo;
            }
        }

        throw new IllegalArgumentException(
                "Todo with ID " + id + " not found"
        );
    }
}