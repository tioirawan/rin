import Translate from '../../src/commands/translate'

describe('command.translate', () => {
    const translate = new Translate()

    it('should return translated text', async () => {
        const result = await translate.handle([
            'id',
            'en',
            'saya suka makan teman'
        ])

        expect(result).toBeDefined()
        expect(result).toBe('I like to eat friends')
    })
})
