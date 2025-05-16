package com.dynac.plantation.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class Comment {
    private String id;
    private String postId;
    private String userId;
    private String username;
    private String userProfileImage;
    private String content;
    private LocalDateTime createdAt = LocalDateTime.now();
}
