import wiki from 'wikijs'

export default class Wiki {
    constructor() {
        this.VARIABLE = {
            default: 'Hah??? you can use `search`, `random`, or `geo` command',
            emptyQuery: 'empty query, like your life...',
            searchNotFound: "I can't find anything m8",
            emptyID: 'empty id :kissing_heart:',
            idNotFound: "I can't find anything :eyes:",
            notEnoughInformation: 'I am not a god... not enough information!',
            resultTooBig:
                "Sorry, I can't show all the results because it's too **BIG**",
            unknownError: 'unknown error',
            geoInvalid: {
                latitude: 'invalid latitude',
                longitude: 'invalid longitude',
                radius: 'invalid radius'
            }
        }
    }

    async handle(command) {
        switch (command[1]) {
            case 'search':
                return await this.search(
                    command
                        .slice(2)
                        .join(' ')
                        .replace(/['"]+/g, '')
                )
            case 'random':
                return await this.random()
            case 'geo':
                return await this.geo(command.slice(2))
            case 'id':
                return await this.id(command[2])
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
        return `**${title}**\n\n${summary}\n\n[Wikipedia](${url})`
    }

    async search(query) {
        if (!query) return this.VARIABLE.emptyQuery

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

    async id(id) {
        if (!id) return this.VARIABLE.emptyID

        let response

        try {
            response = await wiki().findById(id)
        } catch (err) {
            return err.message
        }

        if (response.raw.pageid == 0) return this.VARIABLE.idNotFound

        return await this.compose(response)
    }

    async geo(command) {
        if (command.length < 2) {
            return this.VARIABLE.notEnoughInformation
        }

        let err

        const parameters = command.map((cmd, idx) => {
            const numCmd = parseFloat(cmd)
            if (isNaN(numCmd)) err = this.errGeoMap(idx)

            return numCmd
        })

        if (err) return err

        const results = await wiki().geoSearch(...parameters)

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
            template += `\n\n${this.VARIABLE.resultTooBig}`
        }

        return template
    }

    errGeoMap(num) {
        switch (num) {
            case 0:
                return this.VARIABLE.geoInvalid.latitude
            case 1:
                return this.VARIABLE.geoInvalid.longitude
            case 2:
                return this.VARIABLE.geoInvalid.radius
            default:
                return this.VARIABLE.unknownError
        }
    }
}
