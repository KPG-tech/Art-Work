package com.dynac.plantation.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "posts")
public class Post {
    @Id
    private String id;
    private String title;
    private String image;
    private String description;
    private String userId;
    private String username;
    private String userProfileImage;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    private List<String> likes = new ArrayList<>();
    private List<Comment> comments = new ArrayList<>();
}
