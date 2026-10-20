#include "Audio/DynamicAudioSynthesizer.h"
#include "Sound/SoundWaveProcedural.h"
#include "Misc/Paths.h"

class FMockNPUInferenceEngine : public INPUInferenceEngine
{
public:
    virtual void LoadModelWeights(const FString& InWeightPath) override
    {
        UE_LOG(LogTemp, Log, TEXT("PopMatch Audio: Loaded ONNX voice model weights from %s"), *InWeightPath);
    }

    virtual void GeneratePCMFromText(const FString& InText, TArray<uint8>& OutPCMBuffer) override
    {
        // 44100 Hz mono 16-bit PCM procedural generator for edge synthesis
        const int32 SampleRate = 44100;
        const float DurationSec = 1.2f;
        const int32 TotalSamples = FMath::RoundToInt(SampleRate * DurationSec);
        OutPCMBuffer.SetNumUninitialized(TotalSamples * sizeof(int16));

        int16* Samples = reinterpret_cast<int16*>(OutPCMBuffer.GetData());
        for (int32 i = 0; i < TotalSamples; ++i)
        {
            float Time = static_cast<float>(i) / SampleRate;
            float Wave = FMath::Sin(2.0f * PI * 440.0f * Time) * 0.3f;
            Samples[i] = static_cast<int16>(Wave * 32767.0f);
        }
    }
};

UDynamicAudioSynthesizer::UDynamicAudioSynthesizer()
{
    PrimaryComponentTick.bCanEverTick = false;
    AudioNPUTestRuntime = MakeShared<FMockNPUInferenceEngine>();
}

void UDynamicAudioSynthesizer::BeginPlay()
{
    Super::BeginPlay();
}

void UDynamicAudioSynthesizer::InitializeVoiceSynthesizer(FString CelebrityId)
{
    // Load optimized ONNX voice model weights from local cache
    FString WeightPath = FPaths::ProjectContentDir() + TEXT("Intermediate/VoiceModels/") + CelebrityId + TEXT(".onnx");

    AudioNPUTestRuntime->LoadModelWeights(WeightPath);
    bVoiceEngineReady = true;
}

void UDynamicAudioSynthesizer::SynthesizeCinematicVoiceLine(FString ScriptText, UAudioComponent* TargetAudioComponent)
{
    if (!bVoiceEngineReady || !TargetAudioComponent) return;

    // 1. Convert text payload into raw byte structures using local NPU
    TArray<uint8> GeneratedPCMBuffer;
    AudioNPUTestRuntime->GeneratePCMFromText(ScriptText, GeneratedPCMBuffer);

    // 2. Instantiate a dynamic procedural sound object in UE5 memory
    USoundWaveProcedural* ProceduralWave = NewObject<USoundWaveProcedural>();
    ProceduralWave->SetSampleRate(44100);
    ProceduralWave->NumChannels = 1;
    ProceduralWave->Duration = GeneratedPCMBuffer.Num() / (44100.0f * 2.0f);

    // 3. Queue the synthesized sample frames directly into active audio pipeline memory
    ProceduralWave->QueueAudio(GeneratedPCMBuffer.GetData(), GeneratedPCMBuffer.Num());

    // 4. Force physical play execution on target audio component
    TargetAudioComponent->SetSound(ProceduralWave);
    TargetAudioComponent->Play();
}
