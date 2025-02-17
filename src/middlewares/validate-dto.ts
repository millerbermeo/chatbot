import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export const validateDto = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const dtoInstance = plainToInstance(dtoClass, req.body);
        const errors = await validate(dtoInstance);

        if (errors.length > 0) {
            const formattedErrors = errors.map(err => ({
                property: err.property,
                constraints: err.constraints || {}, // Asegura que constraints no sea undefined
                message: err.constraints ? Object.values(err.constraints).join(', ') : '', 
            }));

            res.status(400).json({ errors: formattedErrors });
            return;
        }

        next(); // Si no hay errores, continuar con el siguiente middleware
    };
};
