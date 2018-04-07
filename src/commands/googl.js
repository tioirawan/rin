import googl from 'goo.gl'

import { notEmpty, isEmpty } from '../core/rin'

export default class Googl {
    constructor() {
        this.INFO = {
            command: 'googl',
            description: 'Create a shortened URL using https://goo.gl/',
            standarize: true,
            required: [
                {
                    value: process.env.GOOGL_API_KEY,
                    toBe: notEmpty
                }
            ]
        }

        this.VARIABLE = {
            emptyURL: this.help
        }
    }

    async ready() {
        googl.setKey(process.env.GOOGL_API_KEY)
    }

    async handle(command) {
        const url = command[0]

        if (isEmpty(url)) return this.VARIABLE.emptyURL

        try {
            return await googl.shorten(url)
        } catch (err) {
            return err.message || JSON.stringify(err)
        }
    }

    get help() {
        const header = 'Wrong format!\n\n'
        const usage = 'usage: `googl <url>`'
        const params = 'Example:\n`rin googl example.com`'

        return header + usage + params
    }
}
