import { progressUpsertPayload } from '../../lib/abstractions/AbstractProgressService';
import { validationService } from '../../services/validationService';

export const validateProgressTracker = validationService.validate({
  bodySchema: progressUpsertPayload,
});
