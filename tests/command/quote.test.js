import Quote from '../../src/commands/quote'

describe('command.quote', () => {
    const quote = new Quote()

    it('should return random quote', async () => {
        const result = await quote.handle()

        expect(result).toBeDefined()
    })

    it('should correctly handle the error', async () => {
        quote.VARIABLE.url = 'http://make.me.error' // to make it error :)

        const result = await quote.handle()

        expect(result).toBeTruthy()
    })
})
