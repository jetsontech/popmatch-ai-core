#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "CelebrityCrushMatchEngine.generated.h"

USTRUCT(BlueprintType)
struct FMovePacket
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString PlayerId;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FVector2D FromCoord;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FVector2D ToCoord;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int64 Timestamp;
};

USTRUCT(BlueprintType)
struct FGridMatch
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    FString CelebrityId;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 Count;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    bool IsCinematicCombo;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    TArray<FVector2D> InvolvedGridCells;
};

USTRUCT(BlueprintType)
struct FMatchResults
{
    GENERATED_BODY()

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    TArray<FGridMatch> Matches;

    UPROPERTY(EditAnywhere, BlueprintReadWrite)
    int32 TotalScoreAwarded;
};

UCLASS(Blueprintable)
class POPMATCHAI_API ACelebrityCrushMatchEngine : public AActor
{
    GENERATED_BODY()

public:
    ACelebrityCrushMatchEngine();

    UFUNCTION(BlueprintCallable, Category = "PopMatch|Gameplay")
    void OnPlayerSwipe(FVector2D StartCell, FVector2D EndCell);

    UFUNCTION(BlueprintCallable, Category = "PopMatch|Gameplay")
    void InitializeHeadlessBoard(int32 Rows, int32 Cols, int32 Seed);

    UFUNCTION(BlueprintCallable, Category = "PopMatch|Gameplay")
    TArray<FGridMatch> EvaluateBoardForMatches();

    UFUNCTION(BlueprintPure, Category = "PopMatch|Gameplay")
    int32 GetRowsCount() const { return BoardRows; }

    UFUNCTION(BlueprintPure, Category = "PopMatch|Gameplay")
    int32 GetColsCount() const { return BoardCols; }

protected:
    virtual void BeginPlay() override;

    void ProcessMatchResults(FMatchResults Results);
    void ExecuteCinematicOrdeal(FString CelebrityId, TArray<FVector2D> TargetCells);
    void TriggerStandardTileClear(TArray<FVector2D> TargetCells);
    void CascadeNewTiles();

    void AnimateTileSwap(FVector2D StartCell, FVector2D EndCell);
    void SetBoardInteractionEnabled(bool bEnabled);

    UFUNCTION()
    void OnCinematicOrdealComplete();

private:
    int32 BoardRows = 8;
    int32 BoardCols = 8;
    int32 BoardSeed = 1337;
    bool bInteractionLocked = false;

    TArray<TArray<FString>> GridState;
};
