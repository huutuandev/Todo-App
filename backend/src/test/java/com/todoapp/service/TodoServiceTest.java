package com.todoapp.service;

import com.todoapp.dto.PagedResponse;
import com.todoapp.dto.TodoRequest;
import com.todoapp.dto.TodoResponse;
import com.todoapp.enums.Priority;
import com.todoapp.exception.ResourceNotFoundException;
import com.todoapp.model.Todo;
import com.todoapp.repository.TodoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TodoServiceTest {

    @Mock
    private TodoRepository todoRepository;

    @InjectMocks
    private TodoService todoService;

    private Todo sampleTodo;

    @BeforeEach
    void setUp() {
        sampleTodo = Todo.builder()
                .id(1L)
                .title("Học Spring Boot")
                .description("Ôn lại JPA và Validation")
                .priority(Priority.HIGH)
                .completed(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void create_shouldTrimTitleAndSetDefaultPriority_whenPriorityIsNull() {
        TodoRequest request = new TodoRequest("  Việc mới  ", "Mô tả", null, null);
        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> {
            Todo t = invocation.getArgument(0);
            t.setId(2L);
            return t;
        });

        TodoResponse response = todoService.create(request);

        assertThat(response.getTitle()).isEqualTo("Việc mới");
        assertThat(response.getPriority()).isEqualTo(Priority.MEDIUM);
        assertThat(response.isCompleted()).isFalse();
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    void getById_shouldReturnTodo_whenExists() {
        when(todoRepository.findById(1L)).thenReturn(Optional.of(sampleTodo));

        TodoResponse response = todoService.getById(1L);

        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getTitle()).isEqualTo("Học Spring Boot");
    }

    @Test
    void getById_shouldThrowResourceNotFound_whenMissing() {
        when(todoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> todoService.getById(99L));
    }

    @Test
    void list_shouldClampInvalidPageSize_andNormalizeBlankKeyword() {
        Pageable expectedPageable = PageRequest.of(0, 10);
        when(todoRepository.search(eq(null), eq(null), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(sampleTodo), expectedPageable, 1));

        PagedResponse<TodoResponse> result = todoService.list("   ", null, -5, 0, "unknownField", "asc");

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getSize()).isEqualTo(10); // size <= 0 falls back to default 10
        assertThat(result.getPage()).isEqualTo(0);  // negative page clamps to 0
    }

    @Test
    void toggleComplete_shouldFlipCompletedFlag() {
        when(todoRepository.findById(1L)).thenReturn(Optional.of(sampleTodo));
        when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TodoResponse response = todoService.toggleComplete(1L);

        assertThat(response.isCompleted()).isTrue();
    }

    @Test
    void delete_shouldThrow_whenTodoDoesNotExist() {
        when(todoRepository.existsById(anyLong())).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> todoService.delete(42L));
        verify(todoRepository, never()).deleteById(anyLong());
    }

    @Test
    void delete_shouldCallRepository_whenTodoExists() {
        when(todoRepository.existsById(1L)).thenReturn(true);

        todoService.delete(1L);

        verify(todoRepository, times(1)).deleteById(1L);
    }

    private static <T> T eq(T value) {
        return org.mockito.ArgumentMatchers.eq(value);
    }
}
