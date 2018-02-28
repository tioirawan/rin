import Rin from '../core/rin'

import pretty from 'prettyjson'
import axios from 'axios'
import moment from 'moment'

export default class Weather {
    constructor() {
        this.INFO = {
            command: 'weather',
            description: 'get weather information',
            standarize: true,
            required: [
                {
                    value: process.env.OPEN_WEATHER_APPID,
                    toBe: Rin.notEmpty
                }
            ]
        }

        this.VARIABLE = {
            unknownError: 'Whoops... something error happened!',
            emptyLocation: '... empty location!\n\nusage: `weather <location>`',
            notFound: "Sorry, I can't find anything"
        }

        this.API_BASE = 'http://api.openweathermap.org/data/2.5/weather'

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

        if (Rin.notEmpty(response.cod)) return response.message

        const result = await this.compose(response, vendor)

        return vendor == 'telegram'
            ? { result, raw: true }
            : Rin.code('', result)
    }

    async fetchWeather(location) {
        try {
            const response = await axios.get(this.API_BASE, {
                params: {
                    q: location,
                    APPID: process.env.OPEN_WEATHER_APPID,
                    units: 'metric'
                }
            })

            return response.data
        } catch (err) {
            return err.response.data
        }
    }

    async compose(data, vendor) {
        const weather = data.weather[0]
        const main = data.main

        const dt = new Date(data.dt * 1000).toUTCString()

        // waiting for stable babel 7 https://github.com/babel/babel/pull/5813
        const rain = data.rain ? data.rain['3h'] : undefined
        const snow = data.snow ? data.rain['3h'] : undefined

        const hpa = vendor == 'discord' ? '\u3371' : 'hPa'
        const celcius = vendor == 'discord' ? '\u2103' : 'C'

        const result = [
            `Location: ${data.name} (${data.sys.country})`,
            `Latitude: ${data.coord.lat}`,
            `Longitude: ${data.coord.lon}`,
            `Weather: ${weather.main} (${weather.description})`,
            `Temperature: ${main.temp} ${celcius}`,
            `Humidity: ${main.humidity} %`,
            `Minimum Temperature: ${main.temp_min} ${celcius}`,
            `Maximum Temperature: ${main.temp_max} ${celcius}`,
            `Pressure: ${main.pressure} ${hpa}`,
            `Sea Level: ${main.sea_level} ${hpa}`,
            `Ground Level: ${main.grnd_level} ${hpa}`,
            `Wind Speed: ${data.wind.speed} m/s`,
            `Wind Direction: ${data.wind.deg} degrees`,
            `Wind Gust: ${data.wind.gust} m/s`,
            `Rain: ${rain} mm`,
            `Snow: ${snow} mm`,
            `Receiving Time: ${dt} (${moment(dt).fromNow()}) `
        ]

        return result
            .map(this.check)
            .filter(x => x)
            .join('\n')
    }

    check(text) {
        if (text.match(/undefined/g)) return

        return text
    }
}
