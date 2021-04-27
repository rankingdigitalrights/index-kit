//"use strict"
let centralConfig = {
  indexPrefix: 'RDR21M',
  filenameSuffix: 'Dev',
  rootFolderID: '14trMtOe_IWDCHoE91naBtgHHx4zZi5_6', // "2019 Back-end testing"
  outputFolderName: '2021 Mini Index', // ID: 1eZxqA2_ebOYs9oMnySKSzV5ybNwrEmMO
  controlSpreadsheetID: '1uEt_u2dd2cedrsL-qDeQ_5qgLQ0U9UADFckponLE3FQ', // 00_Pilot_Dashboard
  YearOnYear: false,
  freezeHead: false,
  serviceColWidth: 280,
  defaultDataColWidth: 100,
  // "firstScoringStep": 3 // regular index
  scoringSteps: [3, 6],
  aggregationParams: {
    // TBD
  },
  dataStoreParams: {
    fileName: 'Data Store',
    summarySheetName: 'Aggregated',
    // "subStepNr": 0,
    firstStepNr: 1,
    lastStepNr: 6,
    dataColWidth: 200,
    integrateOutputs: false,
  },
  // "maxScoringStep": false, // otherwise number
  integrateOutputs: true, // DC: integrate any output component?
  integrateOutputsArray: {
    includeScoring: false, // create regular Outcome?
    isFullScoring: true, // scores or only comments?
    includeCompFeedback: false, // TODO
    includeNotes: true,
    isPilotMode: true, // if true then disable scoring
    researchNotesParams: {
      subStepNr: 1,
      firstStepNr: 1,
      lastStepNr: 6,
      sheetName: 'Researcher Comments',
      dataColWidth: 200,
      hasFullScores: false,
      includeSources: false,
      includeNames: true,
      includeResults: false,
    },
    scoringParams: {
      subStepNr: 0,
      firstStepNr: 1,
      lastStepNr: 6,
      sheetName: 'Outcome',
      dataColWidth: 200,
      hasFullScores: true,
      includeSources: true,
      includeNames: false,
      includeResults: true,
    },
    feedbackParams: {
      subStepNr: 0,
      firstStepNr: 1,
      lastStepNr: 6,
      sheetName: 'Prototype',
      dataColWidth: 200,
      hasFullScores: false,
      includeSources: true,
      includeNames: false,
      includeResults: true,
    },
  },
  collapseAllGroups: false,
  notesSheetname: 'Researcher Comments',
  scoringSheetname: 'Outcome',
  feedbackSheetname: 'RawCompFeedback',
  feedbackStep: 3,
  prevYearOutcomeTab: '2018 Outcome',
  includeRGuidanceLink: false, // TODO
  collapseRGuidance: false,
  summaryParams: {
    // should be in sync with scoringParams in Prod
    spreadsheetName: 'Summary Scores',
    sheetNameSimple: 'Summary minimal',
    splitPrePost: false, // TODO
  },
  feedbackParams: {
    subStepNr: 0,
    firstStepNr: 3,
    lastStepNr: 3,
    sheetName: 'Prototype',
    dataColWidth: 300,
    hasFullScores: false,
    includeSources: true,
    includeNames: false,
    includeResults: true,
    sourcesSheetname: 'Sources referenced',
  },
}
