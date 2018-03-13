import Quote from '../../src/commands/quote'

describe('command.quote', () => {
    const quote = new Quote()

    it('should return random quote', async () => {
        const result = await quote.handle()

        expect(result).toBeDefined()
    })
})
