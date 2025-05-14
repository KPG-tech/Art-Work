package com.dynac.plantation.controller;

import com.dynac.plantation.model.Comment;
import com.dynac.plantation.model.Post;
import com.dynac.plantation.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3002") // Adjust as needed
public class PostController {
    @Autowired
    private PostService postService;

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return new ResponseEntity<>(postService.getAllPosts(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        return new ResponseEntity<>(postService.createPost(post), HttpStatus.CREATED);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Post> likePost(@PathVariable String id, @RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        return new ResponseEntity<>(postService.incrementLike(id, userId), HttpStatus.OK);
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<Post> addComment(@PathVariable String id, @RequestBody Comment comment) {
        return new ResponseEntity<>(postService.addComment(id, comment), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable String id,
            @RequestBody Post postDetails) {
        return ResponseEntity.ok(postService.updatePost(id, postDetails));
    }
}
