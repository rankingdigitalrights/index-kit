//"use strict"
let researchStepsVector = {
  researchSteps: [
    {
      step: 1,
      stepColor: "#ddd9c3",
      substeps: [
        {
          label: "Step 1: Data Collection",
          labelShort: "Step 1",
          subStepID: "S01",
          subStepColor: "#ddd9c3",
          doCollapse: false,
          components: [
            {
              type: "header",
              id: "MN",
              label: "Researcher",
              valueLabel: "researcher",
              placeholderText: "Your Name",
            },
            {
              type: "elementResults",
              id: "R",
              scoringId: "SE",
              label: "Element ",
              valueLabel: "result",
              dropdown: [
                "not selected",
                "yes",
                "partial",
                "no",
                "no disclosure found",
                "N/A",
              ],
            },
            {
              type: "elementComments",
              id: "C",
              label: "Comments for ",
              label2: " (explain score)",
              valueLabel: "comment",
              clipWrap: true,
            },
            {
              type: "sources",
              id: "S",
              label: "Sources (reference, specific page, section, etc.)",
              valueLabel: "sources",
            },
          ],
        },
      ],
    },
    {
      step: 2,
      stepColor: "#c6d9f0",
      substeps: [
        {
          label: "Step 2: Secondary review",
          labelShort: "Step 2",
          subStepID: "S02",
          subStepColor: "#c6d9f0",
          doCollapse: true,
          components: [
            {
              type: "header",
              id: "MN",
              label: "Researcher",
              value: "Researcher",
              placeholderText: "Your Name",
            },
            {
              type: "binaryReview",
              id: "BR",
              label: "Do you agree with the answer(s) in Step 1?",
              dropdown: ["not selected", "yes", "no"],
            },
            {
              type: "elementResults",
              id: "R",
              scoringId: "SE",
              label: "If 'no': suggested answer for ",
              valueLabel: "result",
              dropdown: [
                "not selected",
                "yes",
                "partial",
                "no",
                "no disclosure found",
                "N/A",
              ],
            },
            {
              type: "elementComments",
              id: "C",
              label: "Comments for ",
              label2: "\n(required if 'no', optional if 'yes')",
              valueLabel: "comment",
              clipWrap: true,
            },
            {
              type: "sources",
              id: "S",
              label: "Sources (reference, specific page, section, etc.)",
              valueLabel: "sources",
            },
          ],
        },
      ],
    },
    {
      step: 3,
      stepColor: "#d9ead3",
      substeps: [
        {
          label: "Step 3: Score Consensus",
          labelShort: "Step 3",
          subStepID: "S03",
          subStepColor: "#d9ead3",
          doCollapse: true,
          components: [
            {
              type: "header",
              id: "MN",
              label: "Researcher",
              value: "Researcher",
              placeholderText: "Your Name",
            },
            {
              type: "elementResults",
              id: "R",
              scoringId: "SE",
              label: "Consolidated answer for ",
              valueLabel: "result",
              dropdown: [
                "not selected",
                "yes",
                "partial",
                "no",
                "no disclosure found",
                "N/A",
              ],
            },
            {
              type: "elementComments",
              id: "C",
              label: "Comments for ",
              label2: " (explain score)",
              valueLabel: "comment",
              clipWrap: true,
            },
            {
              type: "sources",
              id: "S",
              label: "Sources (reference, specific page, section, etc.)",
              valueLabel: "sources",
            },
          ],
        },
      ],
    },
    {
      step: 4,
      stepColor: "#d9d2e9",
      substeps: [
        {
          label: "Step 4: Company Notes",
          labelShort: "Step 4",
          subStepID: "S04",
          subStepColor: "#d9d2e9",
          doCollapse: true,
          components: [
            {
              type: "header",
              id: "MN",
              label: "Researcher",
              value: "Researcher",
              placeholderText: "Your Name",
            },
            {
              type: "binaryReview",
              id: "FB",
              label: "Does company feedback merit a change??",
              dropdown: ["not selected", "yes", "no"],
            },
            {
              type: "elementResults",
              label: "If 'yes': suggested answer for ",
              valueLabel: "result",
              id: "R",
              scoringId: "SE",
              dropdown: [
                "not selected",
                "yes",
                "partial",
                "no",
                "no disclosure found",
                "N/A",
                "not piloted",
              ],
            },
            {
              type: "elementComments",
              id: "C",
              label: "Comments for ",
              label2: " (required if 'yes', optional if 'no')",
              valueLabel: "comment",
              clipWrap: true,
            },
            {
              type: "sources",
              id: "S",
              label: "Sources (reference, specific page, section, etc.)",
              valueLabel: "sources",
            },
          ],
        },
      ],
    },
    {
      step: 5,
      stepColor: "#fff2cc",
      substeps: [
        {
          label: "Step 5: Score consolidation and horizontal review",
          labelShort: "Step 5",
          subStepID: "S05",
          subStepColor: "#fff2cc",
          doCollapse: true,
          components: [
            {
              type: "header",
              id: "MN",
              label: "Researcher",
              value: "Researcher",
              placeholderText: "Your Name",
            },
            {
              type: "elementResults",
              id: "R",
              scoringId: "SE",
              label: "Consolidated answer for ",
              valueLabel: "result",
              dropdown: [
                "not selected",
                "yes",
                "partial",
                "no",
                "no disclosure found",
                "N/A",
                "not piloted",
              ],
            },
            {
              type: "elementComments",
              id: "C",
              label: "Comments for ",
              label2: " (explain score)",
              valueLabel: "comment",
              clipWrap: true,
            },
            {
              type: "sources",
              id: "S",
              label: "Sources (reference, specific page, section, etc.)",
              valueLabel: "sources",
            },
          ],
        },
      ],
    },
    {
      step: 6,
      stepColor: "#ead1dc",
      substeps: [
        {
          label: "Step 6: Final Scores",
          labelShort: "Step 6",
          subStepID: "S06",
          subStepColor: "#ead1dc",
          doCollapse: true,
          components: [
            {
              type: "header",
              id: "MN",
              label: "Researcher",
              value: "Researcher",
              placeholderText: "Your Name",
            },
            {
              type: "elementResults",
              id: "R",
              scoringId: "SE",
              label: "Element ",
              valueLabel: "result",
              dropdown: [
                "not selected",
                "yes",
                "partial",
                "no",
                "no disclosure found",
                "N/A",
                "not piloted",
              ],
            },
            {
              type: "elementComments",
              id: "C",
              label: "Comments for ",
              label2: " (explain score)",
              valueLabel: "comment",
              clipWrap: true,
            },
            {
              type: "sources",
              id: "S",
              label: "Sources (reference, specific page, section, etc.)",
              valueLabel: "sources",
            },
          ],
        },
      ],
    },
  ],
};
