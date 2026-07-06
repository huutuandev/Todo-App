package com.todoapp.service.impl;

import com.todoapp.dto.response.PagedResponse;
import com.todoapp.dto.request.TodoRequest;
import com.todoapp.dto.response.TodoResponse;
import com.todoapp.enums.Priority;
import com.todoapp.exception.ResourceNotFoundException;
import com.todoapp.model.Todo;
import com.todoapp.repository.TodoRepository;
import com.todoapp.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;

    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("id", "title", "priority", "completed", "createdAt", "updatedAt");

    @Override
    @Transactional
    public TodoResponse create(TodoRequest request) {
        Todo todo = Todo.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription() == null ? null : request.getDescription().trim())
                .priority(request.getPriority() == null ? Priority.MEDIUM : request.getPriority())
                .completed(request.getCompleted() != null && request.getCompleted())
                .build();
        return TodoResponse.fromEntity(todoRepository.save(todo));
    }

    @Override
    @Transactional(readOnly = true)
    public TodoResponse getById(Long id) {
        return TodoResponse.fromEntity(findEntityOrThrow(id));
    }


    @Override
    @Transactional(readOnly = true)
    public PagedResponse<TodoResponse> list(String keyword, Boolean completed,
                                             int page, int size,
                                             String sortBy, String direction) {
        int safePage = Math.max(page, 0);
        int safeSize = (size <= 0 || size > 100) ? 10 : size;

        String sortField = (sortBy != null && ALLOWED_SORT_FIELDS.contains(sortBy)) ? sortBy : "createdAt";
        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(safePage, safeSize, Sort.by(sortDirection, sortField));

        String normalizedKeyword = (keyword == null || keyword.isBlank()) ? null : keyword.trim();

        Page<Todo> result = todoRepository.search(normalizedKeyword, completed, pageable);
        return PagedResponse.from(result.map(TodoResponse::fromEntity));
    }


    @Override
    @Transactional
    public TodoResponse update(Long id, TodoRequest request) {
        Todo todo = findEntityOrThrow(id);
        todo.setTitle(request.getTitle().trim());
        todo.setDescription(request.getDescription() == null ? null : request.getDescription().trim());
        if (request.getPriority() != null) {
            todo.setPriority(request.getPriority());
        }
        if (request.getCompleted() != null) {
            todo.setCompleted(request.getCompleted());
        }
        return TodoResponse.fromEntity(todoRepository.save(todo));
    }


    @Override
    @Transactional
    public TodoResponse toggleComplete(Long id) {
        Todo todo = findEntityOrThrow(id);
        todo.setCompleted(!todo.isCompleted());
        return TodoResponse.fromEntity(todoRepository.save(todo));
    }


    @Override
    @Transactional
    public void delete(Long id) {
        if (!todoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy công việc với id = " + id);
        }
        todoRepository.deleteById(id);
    }



    private Todo findEntityOrThrow(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy công việc với id = " + id));
    }
}
