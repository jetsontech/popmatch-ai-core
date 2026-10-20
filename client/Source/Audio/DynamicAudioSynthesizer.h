#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "Components/AudioComponent.h"
#include "DynamicAudioSynthesizer.generated.h"

class INPUInferenceEngine
{
public:
    virtual ~INPUInferenceEngine() = default;
    virtual void LoadModelWeights(const FString& InWeightPath) = 0;
    virtual void GeneratePCMFromText(const FString& InText, TArray<uint8>& OutPCMBuffer) = 0;
};

UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class POPMATCHAI_API UDynamicAudioSynthesizer : public UActorComponent
{
    GENERATED_BODY()

public:
    UDynamicAudioSynthesizer();

    UFUNCTION(BlueprintCallable, Category = "PopMatch|Audio")
    void InitializeVoiceSynthesizer(FString CelebrityId);

    UFUNCTION(BlueprintCallable, Category = "PopMatch|Audio")
    void SynthesizeCinematicVoiceLine(FString ScriptText, UAudioComponent* TargetAudioComponent);

    UFUNCTION(BlueprintPure, Category = "PopMatch|Audio")
    bool IsVoiceEngineReady() const { return bVoiceEngineReady; }

protected:
    virtual void BeginPlay() override;

private:
    bool bVoiceEngineReady = false;
    TSharedPtr<INPUInferenceEngine> AudioNPUTestRuntime;
};
