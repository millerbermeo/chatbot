const palabrasClave = [
    "producto", "productos", "artículo", "artículos", "mercancía", "mercadería", "ítem", "ítems", "catálogo", "inventario",
    "quiero ver productos", "ver productos", "mostrar productos", "dame productos", "lista de productos",
    "catálogo de productos", "qué productos tienes", "qué vendes", "qué tienes en venta",
    "mostrar catálogo", "enséñame los productos", "dime qué tienes"
];



export const isGreeting = (message: string) => {
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


export const isInteres = (message: string) => {
    let mensajeDeInteres = 'Me interesa';
    return message.toLowerCase().includes(mensajeDeInteres.toLowerCase());
}


export const isProductos = (message: string) => {
    return palabrasClave.some(palabra => message.toLowerCase().includes(palabra));
}