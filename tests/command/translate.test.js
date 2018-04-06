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

    it('should correctly handle error', async () => {
        const wrongFormat = await translate.handle([''])
        const emptyText = await translate.handle(['en', 'id', ''])

        expect(wrongFormat).toBe(translate.VARIABLE.wrongFormat)
        expect(emptyText).toBe(translate.VARIABLE.emptyText)
    })

    it('should correct real language id', async () => {
        const result = await translate.handle(['id', 'en', 'hello world'])
        const resultWithCorrection = await translate.handle([
            'id',
            'en',
            'helloo wordl'
        ])

        expect(result).toBe('Did you mean from en?\n\nhello world')
        expect(resultWithCorrection).toBe(
            'Did you mean: [hello] [world]?from en\n\nhello world'
        )
    })

    it('should correct text', async () => {
        const result = await translate.handle([
            'en',
            'id',
            'Hello I m mew to pyhton'
        ])

        expect(result).toBe(
            `Did you mean: Hello [I&#39;m] [new] to [python]?\n` +
                `\nHalo, saya baru mengenal python`
        )
    })
})
