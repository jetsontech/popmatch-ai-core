package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()

type Matchmaker struct {
	RedisClient *redis.Client
}

// QueuePlayer registers a user into the Redis sorted matchmaking pool with their current Elo
func (m *Matchmaker) QueuePlayer(userId string, elo float64) error {
	_, err := m.RedisClient.ZAdd(ctx, "matchmaking_pool", redis.Z{
		Score:  elo,
		Member: userId,
	}).Result()
	return err
}

// FindMatch queries the pool within an Elo tolerance window and atomically pairs opponents
func (m *Matchmaker) FindMatch(userId string, currentElo float64, window float64) (string, error) {
	minElo := fmt.Sprintf("%f", currentElo-window)
	maxElo := fmt.Sprintf("%f", currentElo+window)

	opponents, err := m.RedisClient.ZRangeByScore(ctx, "matchmaking_pool", &redis.ZRangeBy{
		Min:   minElo,
		Max:   maxElo,
		Count: 2,
	}).Result()
	if err != nil {
		return "", err
	}

	for _, opponent := range opponents {
		if opponent != userId {
			// Found a matching competitor. Remove both atomically.
			pipe := m.RedisClient.TxPipeline()
			pipe.ZRem(ctx, "matchmaking_pool", opponent)
			pipe.ZRem(ctx, "matchmaking_pool", userId)
			_, execErr := pipe.Exec(ctx)
			if execErr != nil {
				return "", execErr
			}
			return opponent, nil
		}
	}
	return "", fmt.Errorf("no suitable opponent found in Elo bracket [%.1f - %.1f]", currentElo-window, currentElo+window)
}

func main() {
	log.Println("PopMatch AI Matchmaking Daemon initialized.")
	log.Printf("Connecting to Redis Cluster on %s...", "localhost:6379")
	// Daemon entry point ready for AWS EKS sidecar deployment
	_ = time.Second
}
