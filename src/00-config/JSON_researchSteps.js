//"use strict"
let researchStepsVector = {
  researchSteps: [
    {
      step: 1,
      stepColor: '#ddd9c3',
      substeps: [
        {
          label: 'Step 1: Data Collection',
          labelShort: 'Step 1',
          subStepID: 'S01',
          subStepColor: '#ddd9c3',
          doCollapse: false,
          components: [
            {
              type: 'header',
              id: 'MN',
              label: 'Researcher',
              valueLabel: 'researcher',
              placeholderText: 'Your Name',
            },
            {
              type: 'elementResults',
              id: 'R',
              scoringId: 'SE',
              label: 'Element ',
              valueLabel: 'result',
              dropdown: ['not selected', 'yes', 'partial', 'no', 'no disclosure found', 'N/A'],
            },
            {
              type: 'elementComments',
              id: 'C',
              label: 'Comments for ',
              label2: ' (explain score)',
              valueLabel: 'comment',
              clipWrap: true,
            },
            {
              type: 'sources',
              id: 'S',
              label: 'Sources (reference, specific page, section, etc.)',
              valueLabel: 'sources',
            },
          ],
        },
      ],
    },
    {
      step: 2,
      stepColor: '#c6d9f0',
      substeps: [
        {
          label: 'Step 2: Secondary review',
          labelShort: 'Step 2',
          subStepID: 'S02',
          subStepColor: '#c6d9f0',
          doCollapse: true,
          components: [
            {
              type: 'header',
              id: 'MN',
              label: 'Researcher',
              value: 'Researcher',
              placeholderText: 'Your Name',
            },
            {
              type: 'elementResults',
              id: 'R',
              scoringId: 'SE',
              label: 'Element ',
              valueLabel: 'result',
              dropdown: ['not selected', 'yes', 'partial', 'no', 'no disclosure found', 'N/A'],
            },
            {
              type: 'elementComments',
              id: 'C',
              label: 'Comments for ',
              label2: "\n(required if 'no', optional if 'yes')",
              valueLabel: 'comment',
              clipWrap: true,
            },
            {
              type: 'sources',
              id: 'S',
              label: 'Sources (reference, specific page, section, etc.)',
              valueLabel: 'sources',
            },
          ],
        },
      ],
    },
    {
      step: 3,
      stepColor: '#d9ead3',
      substeps: [
        {
          label: 'Step 3: Score Consensus',
          labelShort: 'Step 3',
          subStepID: 'S03',
          subStepColor: '#d9ead3',
          doCollapse: true,
          components: [
            {
              type: 'header',
              id: 'MN',
              label: 'Researcher',
              value: 'Researcher',
              placeholderText: 'Your Name',
            },
            {
              type: 'elementResults',
              id: 'R',
              scoringId: 'SE',
              label: 'Consolidated answer for ',
              valueLabel: 'result',
              dropdown: ['not selected', 'yes', 'partial', 'no', 'no disclosure found', 'N/A'],
            },
            {
              type: 'elementComments',
              id: 'C',
              label: 'Comments for ',
              label2: ' (explain score)',
              valueLabel: 'comment',
              clipWrap: true,
            },
            {
              type: 'sources',
              id: 'S',
              label: 'Sources (reference, specific page, section, etc.)',
              valueLabel: 'sources',
            },
          ],
        },
      ],
    },
  ],
}
