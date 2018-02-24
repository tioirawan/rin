import Rin from '../core/rin'

import weather from 'weather-js'
import pretty from 'prettyjson'

export default class Weather {
    constructor() {
        this.INFO = {
            command: 'weather',
            description: 'get weather information',
            standarize: true
        }

        this.VARIABLE = {
            unknownError: 'Whoops... something error happened!',
            emptyLocation: '... empty location!\n\nusage: `weather <location>`',
            notFound: "Sorry, I can't find anything"
        }

        this.PRETTYOPT = {
            noColor: true
        }
    }

    async handle(command, { vendor }) {
        const location = command.join(' ')

        if (Rin.isEmpty(location)) return this.VARIABLE.emptyLocation

        let response

        try {
            response = await this.fetchWeather(location)
        } catch (err) {
            return err.message || pretty.render(err, this.PRETTYOPT)
        }

        if (!response.length) return this.VARIABLE.notFound

        const best = response[0]

        delete best.location.imagerelativeurl
        delete best.current.imageUrl
        delete best.forecast

        const result =
            vendor == 'discord'
                ? Rin.code('yaml', pretty.render(best, this.PRETTYOPT))
                : JSON.stringify(best, null, 2)

        if (Rin.isEmpty(result)) return this.VARIABLE.unknownError

        return result
    }

    async fetchWeather(location) {
        return new Promise((resolve, reject) => {
            weather.find({ search: location, degreeType: 'C' }, (err, res) => {
                if (err) reject(err)

                resolve(res)
            })
        })
    }
}
