import { progressUpsertPayload } from '../../lib/abstractions/AbstractProgressService.ts';
import { validationService } from '../../services/validationService.ts';

export const validateProgressTracker = validationService.validate({
  bodySchema: progressUpsertPayload,
});
