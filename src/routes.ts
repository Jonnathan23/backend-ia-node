import { Router } from "express"
import { createPrediction, getPrediction } from "./handlers/Predictions";
import { handleInputErrors } from "./middleware/index_middleware";
import { body, param } from "express-validator";

const router = Router()


router.get('/',
    handleInputErrors,
    getPrediction
)

router.post('/',    
    body('date').notEmpty().withMessage('La fecha no puede ir vacia'),    
    handleInputErrors,
    createPrediction
)

router.delete('/:id',
    param('id').isInt().withMessage('No es un id valido'),
    handleInputErrors,
)


export default router;