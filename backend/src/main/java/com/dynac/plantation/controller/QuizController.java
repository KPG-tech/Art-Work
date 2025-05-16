package com.dynac.plantation.controller;

import com.dynac.plantation.model.QuizQuestion;
import com.dynac.plantation.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "http://localhost:3002")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @GetMapping("/random")
    public ResponseEntity<List<QuizQuestion>> getRandomQuiz() {
        return ResponseEntity.ok(quizService.getRandomQuestions());
    }

    @PostMapping
    public ResponseEntity<QuizQuestion> createQuestion(@RequestBody QuizQuestion question) {
        return new ResponseEntity<>(quizService.createQuestion(question), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<QuizQuestion>> getAllQuestions() {
        return ResponseEntity.ok(quizService.getAllQuestions());
    }
}
