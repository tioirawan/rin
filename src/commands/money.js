import fx from 'money'
import axios from 'axios'
import moment from 'moment'
import cf from 'currency-formatter'

import { notEmpty, log } from '../core/rin'

export default class Money {
    constructor() {
        this.INFO = {
            command: 'money',
            description: 'convert currency',
            standarize: true,
            required: [
                {
                    value: process.env.OPEN_EXCHANGE_APP_ID,
                    toBe: notEmpty
                }
            ]
        }

        this.VARIABLE = {
            wrongFormat:
                'wrong format! usage `money [value] [from] to [to]` ex: `money 1 USD to IDR`',
            openExchangeBase: 'http://openexchangerates.org/api/latest.json',
            emptyTo: 'to what???????'
        }

        this.LAST_UPDATE = 0
        this.RATES = []
        this.BASE = 'USD'
    }

    async ready() {
        try {
            await this.fetchRates()
        } catch (err) {
            log.error(err.message || JSON.stringify(err))
        }
    }

    async handle(command) {
        if (this.isTimeToUpdate()) {
            await this.fetchRates()
        }

        if (command.length < 3) return this.VARIABLE.wrongFormat

        const toQuery = command[2]

        if (toQuery == 'to' && !command[3]) {
            return this.VARIABLE.emptyTo
        }

        const currency = (toQuery === 'to' ? command[3] : toQuery).toUpperCase()
        const fromCurrency = command[1].toUpperCase()

        const value = command
            .slice(0, 2)
            .join(' ')
            .toUpperCase()

        fx.base = this.BASE
        fx.rates = this.RATES

        if (!(fromCurrency in fx.rates) || !(currency in fx.rates)) {
            return `unknown currency ${
                !(fromCurrency in fx.rates) ? fromCurrency : currency
            }`
        }

        try {
            const result = await fx(value).to(currency)

            return this.compose({ value, result, currency, fromCurrency })
        } catch (err) {
            return err.message || JSON.stringify(err)
        }
    }

    compose(data) {
        const date = new Date(this.LAST_UPDATE).toUTCString()
        const from = cf.format(data.value, { code: data.fromCurrency })
        const result = cf.format(data.result, { code: data.currency })

        return `${from} = ${result}\n\nLast Updated:\n${date} (__${moment(
            date
        ).fromNow()}__)`
    }

    async fetchRates() {
        log.info('Fetching Open Exchange Rates')

        const response = await axios.get(this.VARIABLE.openExchangeBase, {
            params: {
                app_id: process.env.OPEN_EXCHANGE_APP_ID
            }
        })

        const data = response.data

        this.BASE = data.base
        this.RATES = data.rates
        this.LAST_UPDATE = data.timestamp * 1000
    }

    isTimeToUpdate() {
        return moment().diff(moment(this.LAST_UPDATE), 'h') >= 1
    }
}
