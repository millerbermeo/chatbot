// import whatsappService from "./whatsapp.service"

// class MessageHandler {

//     constructor() {
//         // this.appointmentState = {}
//         // this.assistandState = {}
//     }

//     async handleIncomingMessage(message: any, senderInfo: any) {
//         console.log("📝 Procesando mensaje:", message.text?.body);

//         if (message?.type === "text") {
//             const incomingMessage = message.text.body.toLowerCase().trim();

//             if (this.isGreeting(incomingMessage)) {
//                 await this.sendWelcomeMessage(message.from, message.id, senderInfo); // ❌ Quité senderInfo()
//             } 

//             await whatsappService.markAsRead(message.id);
//         }
//     }


//     isGreeting(message: string) {
//         const greetings = ["hola", "hello", 'hi', 'buenas tardes', 'buenos dias']
//         return greetings.includes(message)
//     }

//     getSenderName(senderInfo: any) {
//         return senderInfo.profile?.name || senderInfo.wa_id
//     }

//     async sendWelcomeMessage(to: string, messageId: string, senderInfo: any) {
//         const name = this.getSenderName(senderInfo)
//         const welcomeMessage = `Hola ${name}, Bienvenido como puedo ayudarte hoy?`
//         await  whatsappService.sendMessage(to, welcomeMessage, messageId)
//     }
// }

// export default new MessageHandler()


import whatsappService from "./whatsapp.service";
import OpenAI from "openai";
import config from "../configs/env"; // Asegúrate de tener la API_KEY en tu configuración
import CategoriasService from "./categorias.service";
import { ProductosServices } from "./productos.service";

const palabrasClave = [
    "producto", "productos", "artículo", "artículos", "mercancía", "mercadería", "ítem", "ítems", "catálogo", "inventario",
    "quiero ver productos", "ver productos", "mostrar productos", "dame productos", "lista de productos",
    "catálogo de productos", "qué productos tienes", "qué vendes", "qué tienes en venta",
    "mostrar catálogo", "enséñame los productos", "dime qué tienes"
];

class MessageHandler {
    private openai: OpenAI;
    private categoriasServices: CategoriasService;
    private productosServices: ProductosServices;

    constructor() {
        this.openai = new OpenAI({ apiKey: config.openai.apiKey });
        this.categoriasServices = new CategoriasService();
        this.productosServices = new ProductosServices();

    }

    async handleIncomingMessage(message: any, senderInfo: any) {
        console.log("📝 Procesando mensaje:", message.text?.body);

        if (message?.type === "text") {

            const incomingMessage = message.text.body.trim(); // No lo convertimos en minúscula para preservar formato
            let response = ''

            if (this.isGreeting(incomingMessage)) {
                response = `📢 ¡Bienvenido a CPUTECH! 🚀\n Hola 👋, gracias por contactarnos. Somos tu tienda de tecnología de confianza. 💻📱🎧\n\n🔹¿Buscas un nuevo gadget, laptop o accesorio?\n🔹¿Necesitas ayuda para encontrar el producto ideal?\n\n ¡Estamos aquí para asesorarte! 😊\n Escríbenos y con gusto te ayudaremos. 💬✨\n\n Visita nuestro catálogo online: https://www.tutienda.com`;
            }


            if (this.isProductos(incomingMessage)) {
                response = "✨ ¡Descubre nuestros productos disponibles! ✨\n\n🌐 Explora nuestro catálogo aquí:\n🔗 https://www.exito.com/tecnologia/computadores/portatiles\n\nSi alguno te interesa o necesitas más información, no dudes en escribirnos. ¡Estamos aquí para ayudarte! 😊";
            }

            if (!isNaN(Number(incomingMessage))) {
                response = await this.productosServices.obtenerProducto(incomingMessage);
            }

            // const response = await this.handleAIResponse(incomingMessage);





            await whatsappService.sendMessage(message.from, response, message.id);
            await whatsappService.markAsRead(message.id);
        }
    }

    async handleAIResponse(userMessage: string): Promise<string> {
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "Te llamas Miller y eres un asistente virtual." },
                    { role: "user", content: userMessage }
                ],
            });

            // Verifica que la respuesta tenga contenido válido
            const aiMessage = response.choices?.[0]?.message?.content?.trim();
            return aiMessage || "Lo siento, no pude generar una respuesta en este momento.";

        } catch (error) {
            console.error("❌ Error con OpenAI:", error);
            return "Hubo un problema al procesar tu mensaje. Inténtalo de nuevo.";
        }
    }



    isProductos(message: string) {
        return palabrasClave.some(palabra => message.toLowerCase().includes(palabra));
    }


    isGreeting(message: string) {
        const greetings = [
            "hola", "hello", "hi", "hey", "qué tal", "buenas", "saludos", "buen día", "buenos días",
            "buenas tardes", "buenas noches", "qué onda", "cómo estás", "cómo va", "qué hay", "qué hubo",
            "qué pasa", "qué más", "alo", "holi", "holis", "holis", "holita", "holiwis"
        ];
    
        // Normalizamos el mensaje y los saludos para eliminar tildes y hacer una comparación consistente
        const normalizedMessage = message.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    
        // Recorremos los saludos y verificamos si están contenidos en el mensaje
        return greetings.some(greeting => normalizedMessage.includes(greeting.normalize("NFD").replace(/[\u0300-\u036f]/g, "")));
    }
    
    



    // isProductosId(message: string) {
    //     return palabrasClave.some(palabra => message.toLowerCase().includes(palabra));
    // }


}

export default new MessageHandler();
