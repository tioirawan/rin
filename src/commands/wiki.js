import wiki from 'wikijs'

import { isEmpty } from '../core/rin'

export default class Wiki {
    constructor() {
        this.INFO = {
            command: 'wiki',
            description: 'search wikipedia',
            standarize: true
        }

        this.VARIABLE = {
            default: 'Hah??? you can use `search`, `random`, or `geo` command',
            emptyQuery: 'Empty query, like your life...',
            searchNotFound: "I can't find anything m8",
            emptyID: 'Empty id',
            idNotFound: "I can't find anything",
            notEnoughInformation:
                'usage: `geo latidute longtidute radius(optional)`',
            resultTooBig:
                "Sorry, I can't show all the results because it's too **BIG**",
            unknownError: 'Unknown error',
            geoNotFound: "Sorry, I can't find anything",
            geoInvalid: [
                'Invalid latitude',
                'Invalid longitude',
                'Invalid radius'
            ]
        }
    }

    async handle(command) {
        switch (command[0]) {
            case 'search':
                return await this.search(command)
            case 'geo':
                return await this.geo(command)
            case 'id':
                return await this.id(command)
            case 'random':
                return await this.random()
            default:
                return this.VARIABLE.default
        }
    }

    async compose(data) {
        const title = data.raw.title
        const url = data.raw.fullurl

        let summary = await data.summary()
        let template = await this.template(title, summary, url)

        const paragraph = summary.split('.')

        let idx = paragraph.length

        while (template.length > 2000 && idx > 0) {
            summary = paragraph.slice(0, idx--).join('.')

            template = await this.template(title, summary, url)
        }

        return template
    }

    async template(title, summary, url) {
        const urlMarkdown = process.env.VENDOR == 'telegram' ? `[${url}]` : url

        return `**${title}**\n\n${summary}\n\n${urlMarkdown}`
    }

    async search(command) {
        const query = command
            .slice(1)
            .join(' ')
            .replace(/['"]+/g, '')

        if (isEmpty(query)) return this.VARIABLE.emptyQuery

        const response = await wiki().search(query)

        if (!response.results.length) {
            return this.VARIABLE.searchNotFound
        }

        const data = await wiki().page(response.results[0])
        const composed = await this.compose(data)

        return `_Query: ${query}_\n\n${composed}`
    }

    async random() {
        const response = await wiki().random()
        const data = await wiki().page(response[0])

        return await this.compose(data)
    }

    async id(command) {
        const id = command[1]

        if (isEmpty(id)) return this.VARIABLE.emptyID

        let response

        try {
            response = await wiki().findById(id)
        } catch (err) {
            return err.message || JSON.stringify(err)
        }

        if (response.raw.pageid == 0) return this.VARIABLE.idNotFound

        return await this.compose(response)
    }

    async geo(command) {
        const params = command.slice(1)

        if (params.length < 2) {
            return this.VARIABLE.notEnoughInformation
        }

        let err

        const parameters = params.map((cmd, idx) => {
            const numCmd = parseFloat(cmd)
            if (isNaN(numCmd)) err = this.VARIABLE.geoInvalid[idx]

            return numCmd
        })

        if (err) return err

        let results

        try {
            results = await wiki().geoSearch(...parameters)
        } catch (err) {
            return err.message || JSON.stringify(err)
        }

        if (!results.length) return this.VARIABLE.geoNotFound

        let concated = 0
        let template = ''

        for (let title of results) {
            const data = await wiki().page(title)
            const dataTemplate = await this.compose(data)

            if (template.length + dataTemplate.length > 2000) break

            concated++
            template += `\n\n${dataTemplate}`
        }

        if (concated < results.length) {
            template += `\n${this.VARIABLE.resultTooBig}\n`
        }

        return template
    }
}
