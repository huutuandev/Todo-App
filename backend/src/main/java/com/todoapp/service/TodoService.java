package com.todoapp.service;

import com.todoapp.dto.request.TodoRequest;
import com.todoapp.dto.response.PagedResponse;
import com.todoapp.dto.response.TodoResponse;

public interface TodoService {

    TodoResponse create(TodoRequest request);
    TodoResponse getById(Long id);
    PagedResponse<TodoResponse> list(String keyword, Boolean completed,
                                     int page, int size,
                                     String sortBy, String direction);

    TodoResponse update(Long id, TodoRequest request);

    TodoResponse toggleComplete(Long id);

    void delete(Long id);
}
