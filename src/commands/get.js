import Rin from '../core/rin'
import axios from 'axios'
import isJson from 'is-json'

export default class Get {
    constructor() {
        this.INFO = {
            command: 'get',
            description: 'perform simple GET http request',
            standarize: true
        }

        this.VARIABLE = {
            emptyURL: this.help
        }
    }

    async handle(command) {
        const url = encodeURI(command[0])

        if (Rin.isEmpty(url)) return this.VARIABLE.emptyURL

        let response

        try {
            response = await axios.get(url, {
                responseType: 'text'
            })
        } catch (err) {
            response = err.message
        }

        response = response.data || response

        let result =
            typeof response == 'object'
                ? JSON.stringify(response, null, 2)
                : response

        return isJson(result) ? Rin.code('json', result) : result
    }

    get help() {
        const header = 'Empty URL!\n'
        const usage =
            'usage: `get <url> *<params>` where params is javascript object (optional)\n\n'
        const params =
            "Example:\n`rin get example.com/random {token:'blablabla', code: 'nanana'}`"

        return header + usage + params
    }
}
