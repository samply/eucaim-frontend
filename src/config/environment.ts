// VITE_TARGET_ENVIRONMENT should be set by the ci pipeline

import type { MeasureGroup, FhirMeasureItem } from '@samply/lens';

import {
	dktkDiagnosisMeasure,
	dktkMedicationStatementsMeasure,
	dktkPatientsMeasure,
	dktkProceduresMeasure,
	dktkSpecimenMeasure,
	dktkHistologyMeasure
} from '../measures';

/**
 * Array of measure groups for different backends
 */
export const measures: MeasureGroup[] = [
	{
		name: 'DKTK',
		measures: [
			dktkPatientsMeasure as FhirMeasureItem,
			dktkDiagnosisMeasure as FhirMeasureItem,
			dktkSpecimenMeasure as FhirMeasureItem,
			dktkProceduresMeasure as FhirMeasureItem,
			dktkMedicationStatementsMeasure as FhirMeasureItem,
			dktkHistologyMeasure as FhirMeasureItem
		]
	}
];