import { TObject } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { Request, Response, NextFunction } from 'express';

class ValidationService {
  // eslint-disable-next-line class-methods-use-this
  validateData(typeBoxType: TObject, data: unknown) {
    const C = TypeCompiler.Compile(typeBoxType);
    const hasErrors = !C.Check(data);
    const errors = hasErrors ? [...C.Errors(data)] : [];

    return errors;
  }

  validate({
    querySchema,
    bodySchema,
    paramsSchema,
  }: {
    querySchema?: TObject;
    bodySchema?: TObject;
    paramsSchema?: TObject;
  }) {
    return (req: Request, _res: Response, next: NextFunction) => {
      const queryErrors = querySchema ? this.validateData(querySchema, req.query) : [];
      const bodyErrors = bodySchema ? this.validateData(bodySchema, req.body) : [];
      const paramsErrors = paramsSchema ? this.validateData(paramsSchema, req.params) : [];

      if (queryErrors?.length || bodyErrors?.length || paramsErrors?.length) {
        return next([...queryErrors, ...bodyErrors, ...paramsErrors]);
      }
      next();
    };
  }
}

export const validationService = new ValidationService();
