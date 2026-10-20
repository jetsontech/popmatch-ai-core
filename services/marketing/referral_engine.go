package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"
)

type ReferralSystem struct {
	SecretKey string
}

// GenerateReferralToken creates a tamper-proof link token for sharing game achievements & virality rewards
func (r *ReferralSystem) GenerateReferralToken(userId string, campaignId string) string {
	timestamp := fmt.Sprintf("%d", time.Now().Unix())
	payload := fmt.Sprintf("%s:%s:%s", userId, campaignId, timestamp)

	// Generate secure HMAC-SHA256 signature to guarantee server verification integrity
	h := hmac.New(sha256.New, []byte(r.SecretKey))
	h.Write([]byte(payload))
	signature := hex.EncodeToString(h.Sum(nil))

	// Return consolidated structural link query payload
	return fmt.Sprintf("token=pm-%s-%s", hex.EncodeToString([]byte(payload)), signature[:12])
}

// ValidateReferralToken verifies that an incoming install token is authentic and unexpired
func (r *ReferralSystem) ValidateReferralToken(token string, maxAgeSeconds int64) (bool, string, string) {
	// Token format: token=pm-<hexPayload>-<sigPrefix>
	var hexPayload, sigPrefix string
	n, err := fmt.Sscanf(token, "token=pm-%[^-]-%s", &hexPayload, &sigPrefix)
	if err != nil || n != 2 {
		return false, "", ""
	}

	rawPayload, err := hex.DecodeString(hexPayload)
	if err != nil {
		return false, "", ""
	}

	var userId, campaignId string
	var timestamp int64
	_, err = fmt.Sscanf(string(rawPayload), "%[^:]:%[^:]:%d", &userId, &campaignId, &timestamp)
	if err != nil {
		return false, "", ""
	}

	// Verify expiration
	if time.Now().Unix()-timestamp > maxAgeSeconds {
		return false, userId, campaignId // Expired
	}

	// Recompute HMAC to verify integrity
	h := hmac.New(sha256.New, []byte(r.SecretKey))
	h.Write(rawPayload)
	expectedSig := hex.EncodeToString(h.Sum(nil))

	if expectedSig[:12] != sigPrefix {
		return false, "", "" // Tampered
	}

	return true, userId, campaignId
}

func main() {
	engine := ReferralSystem{SecretKey: "popmatch_secure_architecture_key_2026"}
	mockToken := engine.GenerateReferralToken("usr_9823f811", "alpha_launch_10k")
	fmt.Printf("🎯 MARKETING SDK: Generated secure viral link token: %s\n", mockToken)

	valid, user, camp := engine.ValidateReferralToken(mockToken, 86400)
	fmt.Printf("🎯 VERIFICATION: Valid=%v, User=%s, Campaign=%s\n", valid, user, camp)
}
