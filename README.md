# PopMatch AI Core (`popmatch-ai-core`)

[![Build & Validation](https://github.com/jetsontech/popmatch-ai-core/actions/workflows/main-ci.yml/badge.svg)](https://github.com/jetsontech/popmatch-ai-core/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![Target Engine](https://img.shields.io/badge/Unreal%20Engine-5.4-blue.svg)](https://www.unrealengine.com)
[![Architecture: Hybrid Cloud-Edge](https://img.shields.io/badge/Cloud-AWS%20EKS%20%7C%20DynamoDB%20%7C%20Redis-orange.svg)](https://aws.amazon.com)

**PopMatch AI** (formerly *Celebrity Crush*) is a next-generation tile-matching puzzle game powered by real-time multimodal generative AI, dynamic MetaHuman facial expressions, live cultural trend streams, and state-authoritative anti-cheat security.

Instead of static colored candy squares, players interact with a dynamic board of **celebrity MetaHuman faces** that react with blendshapes (smirks, anticipation, shock), deliver AI voice punchlines during **Cinematic Ordeals**, and adapt within 30 minutes to breaking pop-culture news via automated **LiveOps Drama Alerts**.

---

## 🌟 Key Architectural Highlights

1. **MetaHuman Tile Matrix (UE5 Dual-LOD Engine):**
   - **LOD 3 (Grid Viewport):** 5,000 polygons with ASTC texture compression. Locked 60–120 FPS performance on mobile devices.
   - **LOD 0 (Cinematic Ordeal):** 80,000+ polygons. Camera sweeps seamlessly into dynamic close-ups during 5-tile combos or synergies with facial blendshapes and voice lines.
2. **State-Authoritative Zero-Trust Anti-Cheat:**
   - Swipes stream encrypted TLS 1.3 telemetry packets `{ MoveIndex, From, To, DeltaMs, Hash }` to a headless Go server running on AWS EKS to prevent client-side memory hacking.
3. **Automated LiveOps Flash Event Engine:**
   - Evaluates entertainment velocity metrics via AWS Kinesis and Lambda.
   - Automatically generates 2-hour Flash Event boards with 3x gacha drops and interactive rival "side-eye" animations.
4. **Transparent Monetization & Pity Mechanics:**
   - Hard pity at 80 pulls, soft pity scaling from 70 pulls, server-authoritative drop rate enforcement.
5. **Viral Marketing Referral Engine:**
   - HMAC-SHA256 crypto-signed referral token system preventing token duplication and spoofing.

---

## 📁 Repository Directory Structure

```text
popmatch-ai-core/
├── .github/
│   └── workflows/
│       └── main-ci.yml                  # Automated Go, Python, and JSON Schema CI
├── architecture/
│   ├── agent_swarm_orchestration.json   # Autonomous AI Engineering Swarm Topology
│   ├── deployment_config.json           # AWS EKS, DynamoDB, Redis, & Route 53 setup
│   └── SYSTEM_ARCHITECTURE.md           # Master technical engineering whitepaper
├── client/
│   ├── PopMatchAI.uproject              # Unreal Engine 5 project definition
│   ├── Source/
│   │   ├── Audio/
│   │   │   ├── DynamicAudioSynthesizer.h
│   │   │   └── DynamicAudioSynthesizer.cpp    # Edge neural vocoder voice synthesis
│   │   ├── Gameplay/
│   │   │   ├── CelebrityCrushMatchEngine.h
│   │   │   └── CelebrityCrushMatchEngine.cpp   # Core C++ match-3 gameplay engine
│   │   ├── Feedback/
│   │   │   ├── HapticJuiceController.h
│   │   │   └── HapticJuiceController.cpp      # Tactile haptic & dopamine juice
│   │   └── Tests/
│   │       └── MatchEngineTests.cpp           # Headless UE5 automation tests
│   └── web-prototype/                   # Interactive Playable Sandbox Prototype
│       ├── index.html                   # HTML5 game UI & gacha simulator
│       ├── style.css                    # Luxury dark-mode glassmorphic styling
│       └── game.js                      # Playable match-3 engine with Web Audio
├── legal/
│   └── COMPLIANCE_FRAMEWORK.md          # GDPR, CCPA, and COPPA compliance matrix
├── services/
│   ├── asset-pipeline/
│   │   ├── ingest_handler.py            # AWS Lambda MetaHuman ingest worker
│   │   └── requirements.txt
│   ├── liveops/
│   │   └── flash_event_spawner.go       # Real-time trending event spawner
│   ├── marketing/
│   │   └── referral_engine.go           # HMAC-SHA256 viral referral generator
│   ├── matchmaking/
│   │   ├── go.mod
│   │   ├── matchmaker.go                # Redis-backed Elo matchmaking service
│   │   └── protocol.proto               # Master gRPC Microservice Schemas
│   └── monetization/
│       ├── gacha_weights.json           # Core server-locked probability matrix
│       └── banners/
│           └── launch_banner_01.json    # "Pop Icons Launch Week" banner config
└── README.md
```

---

## 🚀 Quickstart & Interactive Prototype Testing

### 1. Launch the Playable Web Prototype Locally
You can test the entire gameplay loop, tile matching, audio synthesis, camera flashes, LiveOps drama toggle, and the 80-pull pity Gacha simulator right now:

```bash
# Using Python's built-in HTTP server:
cd client/web-prototype
python -m http.server 3000
```
Open your browser to: **`http://localhost:3000`**

### 2. Run the Viral Referral SDK Test
```bash
python -c "import urllib.request; print('Python 3 ready')"
cd services/marketing
# Test HMAC referral token generation & cryptographic verification
go run referral_engine.go
```

### 3. Validate CI/CD Schemas
```bash
python -c "
import json, glob
for f in glob.glob('**/*.json', recursive=True):
    with open(f) as fp:
        json.load(fp)
    print(f'VALID: {f}')
"
```

---

## 🛠️ GitHub Repository Initialization (jetsontech)

To link and push this codebase directly to your GitHub repository under `jetsontech`:

```bash
git init
git config user.name "jetsontech"
git branch -M main
git remote add origin https://github.com/jetsontech/popmatch-ai-core.git
git add .
git commit -m "feat: complete PopMatch AI core architecture, microservices, and interactive prototype"
git push -u origin main
```

---

## ⚖️ Governance & Compliance
- **GDPR / CCPA:** Transparent user data deletion via CDC pipelines.
- **COPPA:** Strict age-gating (13+) with non-transferable server-authoritative tokens.
- **Zero Facial Data Storage:** No user camera facial biometrics are ingested; all MetaHuman blendshapes run strictly through pre-compiled parametric rigs.
