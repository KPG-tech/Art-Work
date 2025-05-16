package com.dynac.plantation.controller;

import com.dynac.plantation.model.Poll;
import com.dynac.plantation.model.VoteRequest;
import com.dynac.plantation.service.PollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.dynac.plantation.exception.ConflictException;

@RestController
@RequestMapping("/api/polls")
@CrossOrigin(origins = "http://localhost:3002")
public class PollController {

    @Autowired
    private PollService pollService;

    @PostMapping
    public ResponseEntity<Poll> createPoll(@RequestBody Poll poll) {
        return new ResponseEntity<>(pollService.createPoll(poll), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Poll>> getAllPolls() {
        return ResponseEntity.ok(pollService.getAllPolls());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePoll(@PathVariable String id) {
        pollService.deletePoll(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{pollId}/vote")
    public ResponseEntity<Poll> votePoll(
            @PathVariable String pollId,
            @RequestBody VoteRequest voteRequest) {
        try {
            Poll updatedPoll = pollService.votePoll(pollId, voteRequest);
            return ResponseEntity.ok(updatedPoll);
        } catch (ConflictException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Poll> getPollById(@PathVariable String id) {
        Poll poll = pollService.getPollById(id);
        if (poll == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(poll);
    }

    @PutMapping("/{pollId}")
    public ResponseEntity<Poll> updatePoll(
            @PathVariable String pollId,
            @RequestBody Poll updatedPoll) {
        Poll poll = pollService.updatePoll(pollId, updatedPoll);
        return ResponseEntity.ok(poll);
    }
}
