#pragma once

#include "CoreMinimal.h"
#include "Components/ActorComponent.h"
#include "HapticJuiceController.generated.h"

UCLASS(ClassGroup=(Custom), meta=(BlueprintSpawnableComponent))
class POPMATCHAI_API UHapticJuiceController : public UActorComponent
{
    GENERATED_BODY()

public:
    UHapticJuiceController();

    UFUNCTION(BlueprintCallable, Category = "PopMatch|Juice")
    void TriggerJuiceFeedback(int32 ComboCount);

    UFUNCTION(BlueprintCallable, Category = "PopMatch|Juice")
    void TriggerCameraFlashSymphony();

protected:
    virtual void BeginPlay() override;
};
