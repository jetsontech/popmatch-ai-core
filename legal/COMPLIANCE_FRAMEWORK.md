# PopMatch AI Compliance & Governance Framework

**Entity:** PopMatch AI (jetsontech)  
**Standard:** Enterprise Mobile & Cloud Security Baseline (2026)  
**Target Jurisdictions:** United States, European Union, United Kingdom  

---

## 1. Regulatory Alignment Matrix

### GDPR (EU 2016/679) & UK GDPR
- **Right to Erasure (Article 17):** User deletion requests trigger an automated CDC pipeline that purges user partition keys across DynamoDB, Redis session caches, and Timestream telemetry within 30 days.
- **Data Minimization:** No biometric facial geometry is captured from the user's camera. Only standardized synthesized blendshape animations are rendered.
- **Lawful Basis:** Contractual necessity for gameplay state and legitimate interest for anti-cheat verification.

### COPPA (Children's Online Privacy Protection Act)
- PopMatch AI enforces an age-gate (minimum age: 13).
- Accounts flagged under age thresholds are prevented from social chat, live leaderboards, and real-money gacha mechanics.

### California Consumer Privacy Act (CCPA / CPRA)
- Transparent disclosure of zero third-party data sales.
- "Do Not Sell or Share My Personal Info" endpoint exposed in client account settings.

---

## 2. Server-Side Move Verification Consent
By authenticating an account session, the client consents to transparent move-log telemetry streaming (`{ MoveIndex, FromCoord, ToCoord, DeltaTimestamp }`) used strictly to protect state-authoritative multiplayer match integrity against memory manipulation and bot automation.
