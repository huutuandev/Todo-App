package com.todoapp.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todoapp.dto.request.TodoRequest;
import com.todoapp.enums.Priority;
import com.todoapp.model.Todo;
import com.todoapp.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void cleanDatabase() {
        todoRepository.deleteAll();
    }

    @Test
    void create_shouldReturn201_whenRequestIsValid() throws Exception {
        TodoRequest request = new TodoRequest("Viết README", "Hướng dẫn chạy dự án", Priority.HIGH, false);

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Viết README")))
                .andExpect(jsonPath("$.completed", is(false)));
    }

    @Test
    void create_shouldReturn400_whenTitleIsBlank() throws Exception {
        TodoRequest request = new TodoRequest("   ", "Mô tả", null, null);

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Validation Failed")));
    }

    @Test
    void getById_shouldReturn404_whenTodoDoesNotExist() throws Exception {
        mockMvc.perform(get("/api/todos/9999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error", is("Not Found")));
    }

    @Test
    void list_shouldFilterByCompletedStatus() throws Exception {
        todoRepository.save(Todo.builder().title("Việc A").completed(true).priority(Priority.LOW).build());
        todoRepository.save(Todo.builder().title("Việc B").completed(false).priority(Priority.LOW).build());

        mockMvc.perform(get("/api/todos").param("completed", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title", is("Việc A")));
    }

    @Test
    void list_shouldFilterByKeyword() throws Exception {
        todoRepository.save(Todo.builder().title("Học Java").completed(false).priority(Priority.MEDIUM).build());
        todoRepository.save(Todo.builder().title("Mua sách").completed(false).priority(Priority.MEDIUM).build());

        mockMvc.perform(get("/api/todos").param("keyword", "java"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title", is("Học Java")));
    }

    @Test
    void toggleComplete_shouldFlipStatus() throws Exception {
        Todo saved = todoRepository.save(Todo.builder().title("Việc C").completed(false).priority(Priority.LOW).build());

        mockMvc.perform(patch("/api/todos/{id}/toggle", saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completed", is(true)));
    }

    @Test
    void delete_shouldReturn204_thenSubsequentGetReturns404() throws Exception {
        Todo saved = todoRepository.save(Todo.builder().title("Việc D").completed(false).priority(Priority.LOW).build());

        mockMvc.perform(delete("/api/todos/{id}", saved.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/todos/{id}", saved.getId()))
                .andExpect(status().isNotFound());
    }
}
