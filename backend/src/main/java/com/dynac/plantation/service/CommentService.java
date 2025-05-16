// package com.dynac.plantation.service;

// import com.dynac.plantation.exception.ResourceNotFoundException;
// import com.dynac.plantation.model.Comment;
// import com.dynac.plantation.repository.CommentRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import java.time.LocalDateTime;
// import java.util.List;

// @Service
// public class CommentService {
// @Autowired
// private CommentRepository commentRepository;

// public List<Comment> getCommentsByPostId(String postId) {
// return commentRepository.findByPostId(postId);
// }

// public Comment getCommentById(String id) {
// return commentRepository.findById(id)
// .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id:
// " + id));
// }

// public Comment createComment(Comment comment) {
// comment.setCreatedAt(LocalDateTime.now());
// comment.setUpdatedAt(LocalDateTime.now());
// return commentRepository.save(comment);
// }

// public Comment updateComment(String id, Comment commentDetails) {
// Comment comment = getCommentById(id);
// comment.setContent(commentDetails.getContent());
// comment.setUpdatedAt(LocalDateTime.now());
// return commentRepository.save(comment);
// }

// public void deleteComment(String id) {
// Comment comment = getCommentById(id);
// commentRepository.delete(comment);
// }
// }
