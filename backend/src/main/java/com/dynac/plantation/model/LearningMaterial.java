package com.dynac.plantation.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "learning-materials")
public class LearningMaterial {
    @Id
    private String id;
    private String title;
    private String description;
    private String fileUrl;
    private String fileType; // "pdf" or "link"
    private String userId;
    private String username;
    private String userProfileImage;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    private List<Comment> comments = new ArrayList<>();

    @Data
    public static class Comment {
        private String id;
        private String content;
        private String userId;
        private String username;
        private LocalDateTime createdAt = LocalDateTime.now();
    }
}
