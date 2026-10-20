#include "CelebrityCrushMatchEngine.h"

ACelebrityCrushMatchEngine::ACelebrityCrushMatchEngine()
{
    PrimaryActorTick.bCanEverTick = false;
}

void ACelebrityCrushMatchEngine::BeginPlay()
{
    Super::BeginPlay();
    InitializeHeadlessBoard(BoardRows, BoardCols, BoardSeed);
}

void ACelebrityCrushMatchEngine::InitializeHeadlessBoard(int32 Rows, int32 Cols, int32 Seed)
{
    BoardRows = Rows;
    BoardCols = Cols;
    BoardSeed = Seed;

    const TArray<FString> CelebrityPool = {
        TEXT("cel_taylor_swift"),
        TEXT("cel_bruno_mars"),
        TEXT("cel_dua_lipa"),
        TEXT("cel_the_weeknd"),
        TEXT("cel_drake"),
        TEXT("cel_beyonce")
    };

    GridState.Empty();
    GridState.SetNum(BoardRows);

    FRandomStream RandStream(BoardSeed);

    for (int32 r = 0; r < BoardRows; ++r)
    {
        GridState[r].SetNum(BoardCols);
        for (int32 c = 0; c < BoardCols; ++c)
        {
            // Seed generation avoiding immediate matches
            FString PickedCelebrity;
            do {
                int32 Index = RandStream.RandRange(0, CelebrityPool.Num() - 1);
                PickedCelebrity = CelebrityPool[Index];
            } while ((r >= 2 && GridState[r - 1][c] == PickedCelebrity && GridState[r - 2][c] == PickedCelebrity) ||
                     (c >= 2 && GridState[r][c - 1] == PickedCelebrity && GridState[r][c - 2] == PickedCelebrity));

            GridState[r][c] = PickedCelebrity;
        }
    }
}

TArray<FGridMatch> ACelebrityCrushMatchEngine::EvaluateBoardForMatches()
{
    TArray<FGridMatch> FoundMatches;

    // Horizontal check
    for (int32 r = 0; r < BoardRows; ++r)
    {
        int32 MatchLen = 1;
        for (int32 c = 1; c <= BoardCols; ++c)
        {
            if (c < BoardCols && GridState[r][c] == GridState[r][c - 1])
            {
                MatchLen++;
            }
            else
            {
                if (MatchLen >= 3)
                {
                    FGridMatch Match;
                    Match.CelebrityId = GridState[r][c - 1];
                    Match.Count = MatchLen;
                    Match.IsCinematicCombo = (MatchLen >= 5);
                    for (int32 k = c - MatchLen; k < c; ++k)
                    {
                        Match.InvolvedGridCells.Add(FVector2D(r, k));
                    }
                    FoundMatches.Add(Match);
                }
                MatchLen = 1;
            }
        }
    }

    // Vertical check
    for (int32 c = 0; c < BoardCols; ++c)
    {
        int32 MatchLen = 1;
        for (int32 r = 1; r <= BoardRows; ++r)
        {
            if (r < BoardRows && GridState[r][c] == GridState[r - 1][c])
            {
                MatchLen++;
            }
            else
            {
                if (MatchLen >= 3)
                {
                    FGridMatch Match;
                    Match.CelebrityId = GridState[r - 1][c];
                    Match.Count = MatchLen;
                    Match.IsCinematicCombo = (MatchLen >= 5);
                    for (int32 k = r - MatchLen; k < r; ++k)
                    {
                        Match.InvolvedGridCells.Add(FVector2D(k, c));
                    }
                    FoundMatches.Add(Match);
                }
                MatchLen = 1;
            }
        }
    }

    return FoundMatches;
}

void ACelebrityCrushMatchEngine::OnPlayerSwipe(FVector2D StartCell, FVector2D EndCell)
{
    if (bInteractionLocked) return;
    SetBoardInteractionEnabled(false);

    // Swap locally in grid state
    int32 R1 = FMath::RoundToInt(StartCell.X);
    int32 C1 = FMath::RoundToInt(StartCell.Y);
    int32 R2 = FMath::RoundToInt(EndCell.X);
    int32 C2 = FMath::RoundToInt(EndCell.Y);

    if (R1 >= 0 && R1 < BoardRows && C1 >= 0 && C1 < BoardCols &&
        R2 >= 0 && R2 < BoardRows && C2 >= 0 && C2 < BoardCols)
    {
        Swap(GridState[R1][C1], GridState[R2][C2]);
    }

    TArray<FGridMatch> Matches = EvaluateBoardForMatches();
    if (Matches.Num() == 0)
    {
        // Revert swap
        Swap(GridState[R1][C1], GridState[R2][C2]);
        SetBoardInteractionEnabled(true);
        return;
    }

    FMatchResults Results;
    Results.Matches = Matches;
    Results.TotalScoreAwarded = Matches.Num() * 1000;
    ProcessMatchResults(Results);
}

void ACelebrityCrushMatchEngine::ProcessMatchResults(FMatchResults Results)
{
    for (const FGridMatch& Match : Results.Matches)
    {
        if (Match.IsCinematicCombo || Match.Count >= 5)
        {
            ExecuteCinematicOrdeal(Match.CelebrityId, Match.InvolvedGridCells);
            return;
        }
        TriggerStandardTileClear(Match.InvolvedGridCells);
    }
    CascadeNewTiles();
    SetBoardInteractionEnabled(true);
}

void ACelebrityCrushMatchEngine::ExecuteCinematicOrdeal(FString CelebrityId, TArray<FVector2D> TargetCells)
{
    UE_LOG(LogTemp, Log, TEXT("Cinematic Ordeal triggered for: %s with %d tiles"), *CelebrityId, TargetCells.Num());
    TriggerStandardTileClear(TargetCells);
    CascadeNewTiles();
    OnCinematicOrdealComplete();
}

void ACelebrityCrushMatchEngine::TriggerStandardTileClear(TArray<FVector2D> TargetCells)
{
    for (const FVector2D& Cell : TargetCells)
    {
        int32 R = FMath::RoundToInt(Cell.X);
        int32 C = FMath::RoundToInt(Cell.Y);
        if (R >= 0 && R < BoardRows && C >= 0 && C < BoardCols)
        {
            GridState[R][C] = TEXT("");
        }
    }
}

void ACelebrityCrushMatchEngine::CascadeNewTiles()
{
    const TArray<FString> CelebrityPool = {
        TEXT("cel_taylor_swift"),
        TEXT("cel_bruno_mars"),
        TEXT("cel_dua_lipa"),
        TEXT("cel_the_weeknd"),
        TEXT("cel_drake"),
        TEXT("cel_beyonce")
    };

    for (int32 c = 0; c < BoardCols; ++c)
    {
        int32 EmptyRow = BoardRows - 1;
        for (int32 r = BoardRows - 1; r >= 0; --r)
        {
            if (!GridState[r][c].IsEmpty())
            {
                if (EmptyRow != r)
                {
                    GridState[EmptyRow][c] = GridState[r][c];
                    GridState[r][c] = TEXT("");
                }
                EmptyRow--;
            }
        }
        for (int32 r = EmptyRow; r >= 0; --r)
        {
            int32 Pick = FMath::RandRange(0, CelebrityPool.Num() - 1);
            GridState[r][c] = CelebrityPool[Pick];
        }
    }
}

void ACelebrityCrushMatchEngine::AnimateTileSwap(FVector2D StartCell, FVector2D EndCell) {}
void ACelebrityCrushMatchEngine::SetBoardInteractionEnabled(bool bEnabled) { bInteractionLocked = !bEnabled; }
void ACelebrityCrushMatchEngine::OnCinematicOrdealComplete() { SetBoardInteractionEnabled(true); }
