package com.dynac.plantation.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "quiz_questions")
public class QuizQuestion {
    @Id
    private String id;
    private String questionText;
    private List<String> options;
    private String correctAnswer;
    private String category;
    private LocalDateTime createdAt = LocalDateTime.now();
}
