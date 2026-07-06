package com.todoapp.repository;

import com.todoapp.model.Todo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TodoRepository extends JpaRepository<Todo, Long> {


    @Query("""
            SELECT t FROM Todo t
            WHERE (:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                                     OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:completed IS NULL OR t.completed = :completed)
            """)
    Page<Todo> search(@Param("keyword") String keyword,
                       @Param("completed") Boolean completed,
                       Pageable pageable);
}
