import { Request, Response } from 'express'
import colors from 'colors'
import Prediction from '../models/Predictions.model'
import Label from '../models/Labels.model'

export const getPrediction = async (req: Request, res: Response) => {
    try {
        const prediction = await Prediction.findAll({
            order: [['id', 'ASC']],
            include: ['labels']
        })

        res.json({ data: prediction })
    } catch (error: any) {
        console.log(colors.red.bold(error.message))
        res.status(500).json({ error: 'Hubo un error' })
    }
}

export const createPrediction = async (req: Request, res: Response) => {
    try {
        const labels = req.body.labels
        const prediction = await Prediction.create(req.body)
        const { id } = prediction
        prediction.labels = [];

        if (labels.length > 0) {
            for (let i = 0; i < labels.length; i++) {
                const label = await Label.create({ ...labels[i], predictionId: id })
                prediction.labels.push(label)
            }
            await prediction.save()
        }

        res.status(201).json({ data: 'Se ha guardado correctamente' })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export const deletePrediction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const findPrediction = await Prediction.findByPk(id);

        if (!findPrediction) {
            res.status(404).json({ error: 'No se ha encontrado el historial' })
            return
        }

        await findPrediction.destroy();
        res.status(200).json({ data: 'Se ha eliminado correctamente' })
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}