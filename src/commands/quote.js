import axios from 'axios'
export default class Quote {
    constructor() {
        this.INFO = {
            command: 'quote',
            description: 'get random quote',
            standarize: true
        }

        this.VARIABLE = {
            unknownError: 'Whoops... something error happened!',
            url: 'http://quotes.stormconsultancy.co.uk/random.json'
        }
    }

    async handle() {
        return await this.getQuote().then(data => {

            return data
        });
    }

    async getQuote() {
        return axios
            .get(this.VARIABLE.url)
            .then(response => {

                return `_${response.data.quote}_ - **${response.data.author}**`
            })
            .catch(error => {
                return error.message
            })
    }
}
