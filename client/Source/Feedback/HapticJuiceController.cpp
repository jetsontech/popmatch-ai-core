#include "HapticJuiceController.h"
#include "Kismet/GameplayStatics.h"

UHapticJuiceController::UHapticJuiceController()
{
    PrimaryComponentTick.bCanEverTick = false;
}

void UHapticJuiceController::BeginPlay()
{
    Super::BeginPlay();
}

void UHapticJuiceController::TriggerJuiceFeedback(int32 ComboCount)
{
    APlayerController* PC = UGameplayStatics::GetPlayerController(GetWorld(), 0);
    if (!PC) return;

    if (ComboCount <= 2)
    {
        // Light crisp tactile feedback
        PC->PlayDynamicForceFeedback(0.2f, 0.05f, true, true, true, true);
    }
    else if (ComboCount <= 4)
    {
        // Solid mechanical thud
        PC->PlayDynamicForceFeedback(0.6f, 0.12f, true, true, true, true);
    }
    else
    {
        // Explosive bass drop wave pattern
        PC->PlayDynamicForceFeedback(1.0f, 0.35f, true, true, true, true);
        TriggerCameraFlashSymphony();
    }
}

void UHapticJuiceController::TriggerCameraFlashSymphony()
{
    UE_LOG(LogTemp, Log, TEXT("PopMatch: Camera flash and stage spotlight sequence triggered!"));
}
