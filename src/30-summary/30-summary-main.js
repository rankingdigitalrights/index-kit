function getIndicatorRow(company, nrObj) {
    let servicesSufixes = company.services.map(s => `${s.id}SL`)
    let sufixes = ['SI', 'groupSL'].concat(servicesSufixes)
    let formulas = []
    for (const sfx of sufixes) {
      nrObj.service = sfx
      let namedRange = defineNamedRangeStringFromObj(nrObj)
      formulas.push(importRangeFormula(company.data.scoring, namedRange))
    }
    return formulas
}

function getCompanySummaryFormulas(company, indicators, nrObj) {
    let formulas = []
    for (const ind of indicators) {
        nrObj.element = ind
        formulas.push(getIndicatorRow(company, nrObj))
    }
    return formulas
}

function getCompanySummaryHeaders(company) {
    let services = ['Total', 'Group'].concat(company.services.map(s => s.label.current))
    return [Array(services.length).fill(company.label.current), services]
}

function writeCompanySummaries(tab, startingCol, indPfx, companies, compData, indicators, step) {
    
    for (comp of companies) {
        comp.data = compData[comp.id]
        let servicesCount = comp.services.length + 2
        let indicatorsCount = indicators.length
        let headerRange = tab.getRange(1, startingCol, 2, servicesCount)
        headerRange.setValues(getCompanySummaryHeaders(comp))
        
        let scoreFormulas = getCompanySummaryFormulas(comp, indicators, {
            index: indPfx,
            mode: 'SC',
            step: step,
            element: '',
            company: comp.id,
            service: '',
            suffix: ''
        })

        let totalsRange = tab.getRange(3, startingCol, 1, servicesCount)
        let totalsFormulas = Array(servicesCount).fill(`=AVERAGE(R[1]C[0]:R[${indicatorsCount}]C[0])`)
        totalsRange.setFormulas([totalsFormulas])

        let scoresRange = tab.getRange(4, startingCol, indicatorsCount, servicesCount)
        scoresRange.setFormulas(scoreFormulas)

        headerRange.setBorder(true, true, true, true, false, false)
        totalsRange.setBorder(true, true, true, true, false, false)
        scoresRange.setBorder(true, true, true, true, false, false)

        startingCol += servicesCount
    }
}

function writeHeaderColumn(tab, startingCol, indicators, step) {
    let values = [[step], ['Scope'], ['Total']].concat(indicators.map(i => [i]))
    let range = tab.getRange(1, startingCol, values.length, 1)
    range.setValues(values)
    range.setBorder(true, true, true, true, false, false)
}