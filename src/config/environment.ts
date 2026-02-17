// VITE_TARGET_ENVIRONMENT should be set by the ci pipeline

import type { MeasureGroup, MeasureItem } from '@samply/lens';

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
			dktkPatientsMeasure as MeasureItem,
			dktkDiagnosisMeasure as MeasureItem,
			dktkSpecimenMeasure as MeasureItem,
			dktkProceduresMeasure as MeasureItem,
			dktkMedicationStatementsMeasure as MeasureItem,
			dktkHistologyMeasure as MeasureItem
		]
	}
];