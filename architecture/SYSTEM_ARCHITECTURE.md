# PopMatch AI — Core Technical Specification & Engineering Whitepaper

**Repository:** `https://github.com/jetsontech/popmatch-ai-core`  
**Architect:** Principal Systems Architect (jetsontech)  
**Version:** 1.0.0-alpha  
**Engine:** Unreal Engine 5 (UE5) + Edge/Web Sandbox  
**Backend:** Go Microservices, Python Ingestion Workers, AWS EKS/DynamoDB/Redis  

---

## 1. Executive Summary & Vision
**PopMatch AI** (formerly *Celebrity Crush*) is a next-generation tile-matching puzzle game powered by real-time multimodal generative AI, dynamic MetaHuman character expressions, and culturally reactive Live-Ops.

Instead of static candies or flat 2D tiles, the board is composed of dynamic celebrity MetaHuman faces that:
- Visually track player cursor/touches and react with facial blendshapes (smirks, anticipation, shock).
- Deliver AI-synthesized audio punchlines and cinematic camera sweeps upon matching 4+ tiles or triggering contextual synergies (e.g., co-stars, musical collaborators, real-world drama pairs).
- Adapt in real-time to trending cultural moments (2-hour "Drama Alert" flash events with 3x multipliers).

---

## 2. System Architecture Topology

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT TIER                                        |
|  [ Unreal Engine 5 Client ]                    [ HTML5/WebGL High-Fidelity Prototype] |
|   - Nanite / MetaHuman LOD System               - Interactive 8x8 Board               |
|   - Dynamic Camera Sequencer                    - Real-time Reaction Blendshapes       |
|   - Mobile Haptic Juice Controller              - Dopamine Audio/Visual Symphony       |
+---------------------------------------------------------------------------------------+
                                        | (TLS 1.3 Telemetry Stream)
                                        v
+---------------------------------------------------------------------------------------+
|                              AWS EDGE & CLOUDFRONT CDN                                |
|   - S3 Static Assets (ASTC Texture Packs, LOD 0 / LOD 3 MetaHuman Meshes)             |
|   - Route 53 Blue-Green Ingress Gateway                                               |
+---------------------------------------------------------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------------+
|                                AWS EKS CONTAINER CLUSTER                              |
|  +--------------------+  +--------------------+  +---------------------------------+  |
|  | Matchmaker Service |  | State-Authoritative|  | LiveOps Flash Event Spawner     |  |
|  | (Go + Redis Queue) |  | Match Validator    |  | (Go + Redis PubSub + Kinesis)   |  |
|  +--------------------+  +--------------------+  +---------------------------------+  |
|  +--------------------+  +--------------------+  +---------------------------------+  |
|  | Viral Referral SDK |  | Server Gacha Engine|  | Ingest & Vision Worker          |  |
|  | (HMAC-SHA256 Token)|  | (Hard/Soft Pity)   |  | (Python + Lambda/OpenCV)        |  |
|  +--------------------+  +--------------------+  +---------------------------------+  |
+---------------------------------------------------------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------------+
|                                PERSISTENCE DATA LAYER                                 |
|   - Amazon DynamoDB: Users, PlayerProgression, CelebrityRoster, ActiveEvents          |
|   - Amazon ElastiCache (Redis): In-Memory Matchmaking Pools, Live Session States      |
|   - Amazon Timestream: High-Velocity Move-Log & Telemetry Stream                       |
+---------------------------------------------------------------------------------------+
```

---

## 3. Core Architectural Subsystems

### A. MetaHuman Dual-LOD Rendering Pipeline
- **LOD 3 (Grid Viewport):** 5,000 polygons, compressed ASTC textures. Runs locked at 60–120 FPS on mobile chips.
- **LOD 0 (Cinematic Ordeal):** 80,000+ polygons. Swapped seamlessly when triggering 5-tile cascades or synergies. Unreal Engine's `LevelSequencePlayer` takes camera control, zooming in while triggering facial blendshapes (`Gloat_Combo_01`, `Shock_Eyebrow_Raise`) and voice clips.

### B. State-Authoritative Anti-Cheat Verification
- Client sends move packets containing `{ MoveIndex, FromCoord, ToCoord, Timestamp }`.
- Headless Go server replays the deterministic seed to verify board delta and score calculation.
- Speed-hack detection flags any user submitting moves below human neuromuscular reaction thresholds (< 50ms).

### C. LiveOps Real-Time Drama Spawner
- Scrapes trending entertainment metrics (Google Trends, X API).
- Spawns 2-Hour Flash Event boards with 3x Gacha drops.
- Matches between rival celebrities trigger humorous "side-eye" animations and custom dialogue before row clear.

### D. Server-Locked Gacha & Monetization Engine
- **Hard Pity:** Guaranteed Ultra-Rare at 80 pulls.
- **Soft Pity:** Scaling probability curve begins at pull 70 (+5% per pull).
- **Roster Tiers:** Ultra-Rare (1.5%), Rare (8.5%), Common (90.0%).

---

## 4. Autonomous AI Engineering Swarm Topology

```
                  +-----------------------------------+
                  |   PRINCIPAL ARCHITECT AI AGENT    |
                  |     (Orchestration & Review)      |
                  +-----------------+-----------------+
                                    |
         +--------------------------+--------------------------+
         |                          |                          |
         ▼                          ▼                          ▼
+------------------+       +------------------+       +------------------+
| CLIENT-ENGINE    |       | SYSTEMS-BACKEND  |       | TECH-ART PIPELINE|
|    AI AGENT      |       |    AI AGENT      |       |    AI AGENT      |
| (UE5 / C++ Mesh) |       | (Go / Redis / L6)|       | (MetaHuman Rigs) |
+------------------+       +------------------+       +------------------+
         |                          |                          |
         +--------------------------+--------------------------+
                                    |
                                    ▼
                  +-----------------------------------+
                  |     AUTOMATED CI/CD TEST SUITE    |
                  |  (Validates, Merges & Deploys)    |
                  +-----------------------------------+
```

### Specialized Swarm Nodes
- **Node A: Client-Engine AI Agent (C++ / UE5):** Monitors client performance; dynamically tunes LOD scaling arrays and prunes rendering paths when FPS drops below 60 on mobile targets.
- **Node B: Systems-Backend AI Agent (Go / Distributed Systems):** Intercepts network latency spikes and state desyncs; auto-generates patch revisions to match validation scripts and Redis query paths.
- **Node C: Technical Art Pipeline AI Agent (Python / MetaHuman Rigs):** Responds to LiveOps trend alerts; automates Mesh-to-MetaHuman conversion, facial blendshape mapping, and CDN bundle distribution.

### Multi-Agent Autonomous Guardrail & Review Loop
1. **Code Proposal:** An engineering agent proposes a patch or feature branch.
2. **Peer Review:** Sandboxed Reviewer Agent runs static analysis scanning for memory safety, architectural alignment, and logic regressions.
3. **Simulation Testing:** Automated compilation and execution through headless `MatchEngineTests.cpp`.
4. **Autonomous Merge:** Upon full validation, the Principal Architect Agent signs and deploys the release with 0ms downtime.

