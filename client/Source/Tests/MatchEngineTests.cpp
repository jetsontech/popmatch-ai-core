#if WITH_DEV_AUTOMATION_TESTS
#include "CoreMinimal.h"
#include "Misc/AutomationTest.h"
#include "Gameplay/CelebrityCrushMatchEngine.h"

IMPLEMENT_COMPLEX_AUTOMATION_TEST(FPopMatchEngineGridTest, "PopMatchAI.Gameplay.GridInitialization", EAutomationTestFlags::ApplicationContextMask | EAutomationTestFlags::ProductFilter)

void FPopMatchEngineGridTest::GetTests(TArray<FString>& OutBehaviors, TArray<FString>& OutTestNames) const
{
    OutBehaviors.Add(TEXT("Standard_8x8"));
    OutBehaviors.Add(TEXT("Blitz_6x6"));
}

bool FPopMatchEngineGridTest::RunTest(const FString& Parameters)
{
    ACelebrityCrushMatchEngine* TestEngine = NewObject<ACelebrityCrushMatchEngine>();
    int32 ExpectedRows = Parameters.Equals(TEXT("Blitz_6x6")) ? 6 : 8;
    int32 ExpectedCols = ExpectedRows;
    TestEngine->InitializeHeadlessBoard(ExpectedRows, ExpectedCols, 42);

    // Test 1: Grid Dimensions Validation
    UTEST_EQUAL(TEXT("Validating total generated rows count matches configuration dimensions"), TestEngine->GetRowsCount(), ExpectedRows);
    UTEST_EQUAL(TEXT("Validating total generated columns count matches configuration dimensions"), TestEngine->GetColsCount(), ExpectedCols);

    // Test 2: Verification of Safe Board State (No matches present on spawn)
    bool bHasStartingMatches = TestEngine->EvaluateBoardForMatches().Num() > 0;
    UTEST_FALSE(TEXT("Ensuring initial generated seed does not contain immediate pre-made matches"), bHasStartingMatches);

    return true;
}
#endif
