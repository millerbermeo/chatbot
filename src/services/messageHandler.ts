import whatsappService from "./whatsapp.service";

class ChatbotDomicilios {
  private estados: Record<
    string,
    {
      paso: string;
      pedido?: string;
      direccionRecogida?: string;
      direccionEntrega?: string;
    }
  > = {};

  private async handleEmpresaResponse(message: any) {
    const respuesta = message?.interactive?.button_reply?.title?.toLowerCase();
    if (!respuesta) return;

    if (respuesta === "aceptar") {
      const ahora = new Date();
      const horaEntrega = new Date(ahora.getTime() + 30 * 60000); // 30 minutos después
      const formatoHora = horaEntrega.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
      });

      await whatsappService.sendMessage(
        "573232205900",
        `✅ Pedido aceptado. Tienes *30 minutos* a partir de ahora para entregar el pedido. Hora límite estimada: *${formatoHora}*`
      );
    } else if (respuesta === "rechazar") {
      await whatsappService.sendMessage(
        "573232205900",
        `❌ Pedido rechazado. Se notificará al cliente.`
      );
    }
  }

  async handleIncomingMessage(message: any) {
    const texto =
      message?.text?.body?.trim().toLowerCase() ||
      message?.interactive?.button_reply?.title?.trim().toLowerCase();

    const from = message.from;
    if (!texto) return;

    // 👇 Verifica si es el número fijo (empresa)
    if (from === "573232205900") {
      await this.handleEmpresaResponse(message);
      return;
    }

    const estadoActual = this.estados[from] || { paso: "inicio" };

    switch (estadoActual.paso) {
        case "inicio":
            this.estados[from] = { paso: "esperando_confirmacion" };
            const botonesInicio = [
              { type: "reply", reply: { id: "si", title: "Sí" } },
              { type: "reply", reply: { id: "convenio", title: "Convenio" } },
              { type: "reply", reply: { id: "no", title: "No" } },
            ];
            await whatsappService.sendInteractiveButtons(
              from,
              "👋 ¡Hola! Bienvenido a *Domicilios Express* 🚴‍♂️\n¿Deseas hacer un pedido? 🛍️",
              botonesInicio
            );
            break;

      case "esperando_confirmacion":
        if (texto.includes("sí") || texto.includes("si") || texto.includes("quiero")) {
          this.estados[from].paso = "esperando_pedido";
          await whatsappService.sendMessage(
            from,
            `✅ ¡Perfecto! Por favor escribe tu pedido y nosotros lo realizaremos por ti 🛍️\n\n🛒 Puedes ver nuestro catálogo aquí:\nhttps://e-commerce-front-theta.vercel.app/`,
            message.id
          );
        } else if (texto.includes("convenio")) {
          const nombreContacto = message?.contacts?.[0]?.profile?.name || "cliente";
          const resumen = `📢 *Tienes un domicilio por convenio*\n\n👤 Convenio: *${nombreContacto}*\n📞 Número: *${from}*`;

          const buttons = [
            { type: "reply", reply: { id: "aceptar", title: "Aceptar" } },
            { type: "reply", reply: { id: "rechazar", title: "Rechazar" } },
          ];

          await whatsappService.sendMessage(
            from,
            `🚀 Su domicilio fue confirmado automáticamente, *${nombreContacto}*. En breve un repartidor pasará a recogerlo. 🙌`
          );

          await whatsappService.sendInteractiveButtons("573232205900", resumen, buttons);

          delete this.estados[from];
        } else {
          await whatsappService.sendMessage(
            from,
            `🙌 Ok, si cambias de opinión solo escribe "sí" para continuar.`,
            message.id
          );
        }
        break;

      case "esperando_pedido":
        if (texto.charAt(0) === "#") {
          // Pedido rápido, sin dirección de recogida
          this.estados[from].pedido = texto.substring(1).trim(); // sin #
          this.estados[from].direccionRecogida = "NO APLICA (Convenio)";
          this.estados[from].paso = "esperando_direccion_entrega";

          await whatsappService.sendMessage(
            from,
            `📦 ¿A qué dirección debemos entregar el pedido?`,
            message.id
          );
        } else {
          this.estados[from].pedido = texto;
          this.estados[from].paso = "esperando_direccion_recogida";

          await whatsappService.sendMessage(
            from,
            `📍 ¿Desde qué dirección debemos recoger el pedido?`,
            message.id
          );
        }
        break;

      case "esperando_direccion_recogida":
        this.estados[from].direccionRecogida = texto;
        this.estados[from].paso = "esperando_direccion_entrega";
        await whatsappService.sendMessage(
          from,
          `📦 ¿A qué dirección debemos entregar el pedido?`,
          message.id
        );
        break;

      case "esperando_direccion_entrega":
        this.estados[from].direccionEntrega = texto;
        this.estados[from].paso = "confirmacion_final";

        const buttons = [
          { type: "reply", reply: { id: "si", title: "Sí" } },
          { type: "reply", reply: { id: "no", title: "No" } },
        ];
        const resumen = `📝 Pedido: *${this.estados[from].pedido}*\n📍 Recoger en: *${this.estados[from].direccionRecogida}*\n📦 Entregar en: *${this.estados[from].direccionEntrega}*`;

        await whatsappService.sendInteractiveButtons(
          from,
          `${resumen}\n\n¿Confirmas estos datos? (sí/no)`,
          buttons
        );
        break;

        case "confirmacion_final":
            if (texto.includes("sí") || texto.includes("si")) {
              const datos = this.estados[from];
          
              // Si el pedido fue por convenio (#), usa un nombre de local en la dirección de recogida para la empresa
              const direccionRecogidaParaEmpresa = datos.direccionRecogida === "NO APLICA (Convenio)"
                ? "Restaurante Calle Primera" // aquí cambias el nombre del local según convenga
                : datos.direccionRecogida;
          
              const resumen = `📢 *Tienes un nuevo domicilio pendiente*\n\n🛍️ Pedido: *${datos.pedido}*\n📍 Dirección de recogida: *${direccionRecogidaParaEmpresa}*\n📦 Dirección de entrega: *${datos.direccionEntrega}*\n👤 Cliente: *${from}*`;
          
              await whatsappService.sendMessage(
                from,
                `🚀 ¡Pedido confirmado! En breve un repartidor pasará a recogerlo.\nGracias por confiar en *Domicilios Express* 🙌`,
                message.id
              );
          
              const buttons = [
                { type: "reply", reply: { id: "aceptar", title: "Aceptar" } },
                { type: "reply", reply: { id: "rechazar", title: "Rechazar" } },
              ];
          
              await whatsappService.sendInteractiveButtons(
                "573232205900",
                resumen,
                buttons
              );
          
              delete this.estados[from];
            } else {
              this.estados[from].paso = "esperando_pedido";
              await whatsappService.sendMessage(
                from,
                `❌ Ok, pedido cancelado. Por favor escribe nuevamente tu pedido.`,
                message.id
              );
            }
            break;

      default:
        await whatsappService.sendMessage(
          from,
          `🤖 Lo siento, no entendí tu mensaje. Escribe "hola" para comenzar.`,
          message.id
        );
        break;
    }

    await whatsappService.markAsRead(message.id);
  }
}

export default new ChatbotDomicilios();
