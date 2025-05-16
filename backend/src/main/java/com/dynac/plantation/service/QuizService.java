package com.dynac.plantation.service;

import com.dynac.plantation.model.QuizQuestion;
import com.dynac.plantation.repository.QuizQuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.SampleOperation;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class QuizService {

    private final QuizQuestionRepository quizQuestionRepository;
    private final MongoTemplate mongoTemplate;

    @Autowired
    public QuizService(QuizQuestionRepository quizQuestionRepository, MongoTemplate mongoTemplate) {
        this.quizQuestionRepository = quizQuestionRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public List<QuizQuestion> getRandomQuestions() {
        SampleOperation sampleStage = Aggregation.sample(10);
        Aggregation aggregation = Aggregation.newAggregation(sampleStage);
        return mongoTemplate.aggregate(aggregation, "quiz_questions", QuizQuestion.class)
                .getMappedResults();
    }

    public QuizQuestion createQuestion(QuizQuestion question) {
        return quizQuestionRepository.save(question);
    }

    public List<QuizQuestion> getAllQuestions() {
        return quizQuestionRepository.findAll();
    }
}
