export const dktkPatientsMeasure = {
	key: 'patients',
	measure: {
		code: {
			text: 'patients'
		},
		population: [
			{
				code: {
					coding: [
						{
							system: 'http://terminology.hl7.org/CodeSystem/measure-population',
							code: 'initial-population'
						}
					]
				},
				criteria: {
					language: 'text/cql-identifier',
					expression: 'InInitialPopulation'
				}
			}
		],
		stratifier: [
			{
				code: {
					text: 'Gender'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Gender'
				}
			},
			{
				code: {
					text: '75186-7'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Deceased'
				}
			},
			{
				code: {
					text: 'Age'
				},
				criteria: {
					language: 'text/cql',
					expression: 'AgeClass'
				}
			}
		]
	},
	cql: `

DKTK_STRAT_GENDER_STRATIFIER

DKTK_STRAT_PRIMARY_DIAGNOSIS_STRATIFIER
DKTK_STRAT_AGE_CLASS_STRATIFIER

DKTK_STRAT_DECEASED_STRATIFIER
`
};

export const dktkDiagnosisMeasure = {
	key: 'diagnosis',
	measure: {
		code: {
			text: 'diagnosis'
		},
		extension: [
			{
				url: 'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-populationBasis',
				valueCode: 'Condition'
			}
		],
		population: [
			{
				code: {
					coding: [
						{
							system: 'http://terminology.hl7.org/CodeSystem/measure-population',
							code: 'initial-population'
						}
					]
				},
				criteria: {
					language: 'text/cql-identifier',
					expression: 'Diagnosis'
				}
			}
		],
		stratifier: [
			{
				code: {
					text: 'diagnosis'
				},
				criteria: {
					language: 'text/cql-identifier',
					expression: 'DiagnosisCode'
				}
			}
		]
	},
	cql: `
DKTK_STRAT_DIAGNOSIS_STRATIFIER
`
};

export const dktkSpecimenMeasure = {
	key: 'specimen',
	measure: {
		code: {
			text: 'specimen'
		},
		extension: [
			{
				url: 'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-populationBasis',
				valueCode: 'Specimen'
			}
		],
		population: [
			{
				code: {
					coding: [
						{
							system: 'http://terminology.hl7.org/CodeSystem/measure-population',
							code: 'initial-population'
						}
					]
				},
				criteria: {
					language: 'text/cql-identifier',
					expression: 'Specimen'
				}
			}
		],
		stratifier: [
			{
				code: {
					text: 'sample_kind'
				},
				criteria: {
					language: 'text/cql',
					expression: 'SampleType'
				}
			}
		]
	},
	cql: `
DKTK_STRAT_SPECIMEN_STRATIFIER
`
};

export const dktkProceduresMeasure = {
	key: 'procedures',
	measure: {
		code: {
			text: 'procedures'
		},
		extension: [
			{
				url: 'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-populationBasis',
				valueCode: 'Procedure'
			}
		],
		population: [
			{
				code: {
					coding: [
						{
							system: 'http://terminology.hl7.org/CodeSystem/measure-population',
							code: 'initial-population'
						}
					]
				},
				criteria: {
					language: 'text/cql-identifier',
					expression: 'Procedure'
				}
			}
		],
		stratifier: [
			{
				code: {
					text: 'ProcedureType'
				},
				criteria: {
					language: 'text/cql',
					expression: 'ProcedureType'
				}
			}
		]
	},
	cql: `
DKTK_STRAT_PROCEDURE_STRATIFIER
`
};

export const dktkMedicationStatementsMeasure = {
	key: 'medicationStatements',
	measure: {
		code: {
			text: 'medicationStatements'
		},
		extension: [
			{
				url: 'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-populationBasis',
				valueCode: 'MedicationStatement'
			}
		],
		population: [
			{
				code: {
					coding: [
						{
							system: 'http://terminology.hl7.org/CodeSystem/measure-population',
							code: 'initial-population'
						}
					]
				},
				criteria: {
					language: 'text/cql-identifier',
					expression: 'MedicationStatement'
				}
			}
		],
		stratifier: [
			{
				code: {
					text: 'MedicationType'
				},
				criteria: {
					language: 'text/cql',
					expression: 'ProcedureType'
				}
			}
		]
	},
	cql: `
DKTK_STRAT_MEDICATION_STRATIFIER
`
};

export const dktkHistologyMeasure = {
	key: 'Histo',
	measure: {
		code: {
			text: 'Histo'
		},
		extension: [
			{
				url: 'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-populationBasis',
				valueCode: 'Observation'
			}
		],
		population: [
			{
				code: {
					coding: [
						{
							system: 'http://terminology.hl7.org/CodeSystem/measure-population',
							code: 'initial-population'
						}
					]
				},
				criteria: {
					language: 'text/cql-identifier',
					expression: 'Histo'
				}
			}
		],
		stratifier: [
			{
				code: {
					text: 'Histlogoies'
				},
				criteria: {
					language: 'text/cql-identifier',
					expression: 'Histlogoy'
				}
			}
		]
	},
	cql: `
  DKTK_STRAT_HISTOLOGY_STRATIFIER
`
};
