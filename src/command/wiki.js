import wiki from 'wikijs'

export default class Wiki {
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
                return 'Hah??? you can use `search`, `random`, or `geo` command'
        }
    }

    async compose(data) {
        const title = data.raw.title
        const url = data.raw.fullurl

        let summary = await data.summary()
        let template = await this.template(title, summary, url)

        while (template.length > 2000) {
            summary = summary.split('.')[0]

            template = await this.template(title, summary, url)
        }

        return template
    }

    async template(title, summary, url) {
        return `**${title}**\n\n${summary}\n\n${url}`
    }

    async search(query) {
        if (!query) return 'empty query, like your life...'

        const response = await wiki().search(query)

        if (!response.results.length) {
            return "I can't find anything m8"
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
        if (!id) return 'empty id :kissing_heart:'

        let response

        try {
            response = await wiki().findById(id)
        } catch (err) {
            return err.message
        }

        if (response.raw.pageid == 0) return "I can't find anything :eyes:"

        return await this.compose(response)
    }

    async geo(command) {
        if (command.length < 2) {
            return 'I am not a god... not enough information!'
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
            template +=
                "\n\nSorry, I can't show all the results because it's too **BIG**"
        }

        return template
    }

    errGeoMap(num) {
        switch (num) {
            case 0:
                return 'invalid latitude'
            case 1:
                return 'invalid longitude'
            case 2:
                return 'invalid radius'
            default:
                return 'unknown error'
        }
    }
}
