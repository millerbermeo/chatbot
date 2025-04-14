import sendToWhatsapp from "./http/send-to-whatsapp";

class WhatsappService {
    async sendMessage(to:string, body:any, messageId?: any) {
        const data = {
            messaging_product: 'whatsapp',
            to,
            text: {body}
        }

        await sendToWhatsapp(data)
    }

    async markAsRead(messageId: any) {
        const data = {
            messaging_product: 'whatsapp',
            status: 'read',
            messageId: messageId
        }

        await sendToWhatsapp(data)
    }


    async sendInteractiveButtons(to: string, bodyText: string, buttons: any) {
        const data = {
          messaging_product: 'whatsapp',
          to,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: { text: bodyText },
            action: {
              buttons: buttons,
            },
          },
        };
    
        await sendToWhatsapp(data);
      }
}

export default new WhatsappService()