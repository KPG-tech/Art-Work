package com.dynac.plantation.service;

import com.dynac.plantation.exception.ResourceNotFoundException;
import com.dynac.plantation.model.Poll;
import com.dynac.plantation.model.VoteRequest;
import com.dynac.plantation.repository.PollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.core.query.UpdateDefinition.ArrayFilter;
import com.dynac.plantation.exception.ConflictException;
import org.bson.Document;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.List;

@Service
public class PollService {

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public Poll createPoll(Poll poll) {
        poll.getOptions().forEach(option -> option.setId(UUID.randomUUID().toString()));
        return pollRepository.save(poll);
    }

    public void deletePoll(String id) {
        pollRepository.deleteById(id);
    }

    public Poll votePoll(String pollId, VoteRequest voteRequest) {
        // Step 1: remove the userId from all votes arrays
        Query removeQuery = new Query(Criteria.where("_id").is(pollId));
        Update removeUpdate = new Update().pull("options.$[].votes", voteRequest.getUserId());
        mongoTemplate.updateFirst(removeQuery, removeUpdate, Poll.class);

        // Step 2: add the userId to the selected option
        Query addQuery = new Query(Criteria.where("_id").is(pollId)
                .and("options._id").is(voteRequest.getOptionId()));
        Update addUpdate = new Update().addToSet("options.$.votes", voteRequest.getUserId());

        FindAndModifyOptions options = new FindAndModifyOptions()
                .returnNew(true)
                .upsert(false);

        Poll updatedPoll = mongoTemplate.findAndModify(addQuery, addUpdate, options, Poll.class);

        if (updatedPoll == null) {
            throw new RuntimeException("Failed to update vote");
        }

        return updatedPoll;
    }

    public Poll getPollById(String id) {
        return pollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found with id: " + id));
    }

    public List<Poll> getAllPolls() {
        return pollRepository.findAllByOrderByCreatedAtDesc();
    }

    public Poll updatePoll(String id, Poll poll) {
        Poll existingPoll = pollRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Poll not found with id: " + id));

        existingPoll.setQuestion(poll.getQuestion());
        existingPoll.setOptions(poll.getOptions());
        existingPoll.setUpdatedAt(poll.getUpdatedAt());

        return pollRepository.save(existingPoll);
    }
}
