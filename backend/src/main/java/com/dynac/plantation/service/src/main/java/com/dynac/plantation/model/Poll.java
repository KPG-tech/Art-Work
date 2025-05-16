package com.dynac.plantation.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "polls")
public class Poll {
        @Id
        private String id;
        private String question;
        private List<PollOption> options = new ArrayList<>();
        private String userId;
        private String username;
        private String userProfileImage;
        private LocalDateTime createdAt = LocalDateTime.now();
        private LocalDateTime updatedAt = LocalDateTime.now();

        @Data
        public static class PollOption {
                private String id; // Stored as "id" in MongoDB
                private String text;
                private List<String> votes = new ArrayList<>();
        }
}
