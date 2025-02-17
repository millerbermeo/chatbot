import axios from 'axios'
import  config  from '../../configs/env';


const sendToWhatsapp = async(data: any) => {
    const baseUrl = `${config.api.baseUrl}/${config.api.version}/${config.business.phone}/messages`
    const headers = {
        Authorization: `Bearer ${config.webhook.apiToken}`
    }

    try {
        const response = await axios({
            method: 'POST',
            url: baseUrl,
            headers: headers,
            data
        })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export default sendToWhatsapp
