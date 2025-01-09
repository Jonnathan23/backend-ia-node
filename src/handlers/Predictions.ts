import { Request, Response } from 'express'
import colors from 'colors'
import Prediction from '../models/Predictions.model'
import Label from '../models/Labels.model'
import { uploadImageToGoogleCloud } from '../utils/google-storage'

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

        const file = req.file;
        if (!file) {
            res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
            return
        }

        const imageUrl = await uploadImageToGoogleCloud(file);

        console.log(colors.yellow.bold(imageUrl))
        console.log("Raw labels:", req.body.labels);


        const labels = JSON.parse(req.body.labels);
        const { date } = req.body;
        const prediction = await Prediction.create({ image: imageUrl, date });        
  
        if (labels && labels.length > 0) {
            for (const label of labels) {
                await Label.create({ ...label, predictionId: prediction.id });
            }
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