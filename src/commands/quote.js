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
        var result = this.getQuote().then(data => {
            return data
        })

        return result
    }

    async getQuote() {
        var axios = require('axios')
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
