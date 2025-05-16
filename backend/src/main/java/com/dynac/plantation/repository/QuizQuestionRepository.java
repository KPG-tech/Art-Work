package com.dynac.plantation.repository;

import com.dynac.plantation.model.QuizQuestion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizQuestionRepository extends MongoRepository<QuizQuestion, String> {
}
