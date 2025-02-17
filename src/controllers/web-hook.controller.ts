import { Request, Response } from 'express';
import  config  from '../configs/env';
import messageHandler from '../services/messageHandler';

class WebhookController {
    // Manejar Entrada
    async handleIncoming(req: Request, res: Response) {
        console.log("🔹 Payload recibido:", JSON.stringify(req.body, null, 2));
    
        const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]; // Corregido "messages" en plural
        const senderInfo = req.body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0];
    
        console.log("📩 Mensaje recibido:", message);
        console.log("👤 Información del remitente:", senderInfo);
    
        if (message) {
            await messageHandler.handleIncomingMessage(message, senderInfo);
        }
    
        res.sendStatus(200);
    }
    

    verifyWebHook(req: Request, res: Response) {
        const mode = req.query['hub.mode']
        const token = req.query['hub.verify_token']
        const challenge = req.query['hub.challenge']

        if (mode === 'subscribe' && token === config.webhook.verifyToken) {
            res.status(200).send(challenge)
            console.log('Webhook verificado !!!!!')
        } else {
            res.sendStatus(403)
        }
    }
}

export default new WebhookController()