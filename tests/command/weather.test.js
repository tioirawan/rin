import Weather from '../../src/commands/weather'

describe('command.weather', () => {
    const weather = new Weather()

    it('should return weather information', async () => {
        const result = await weather.handle([''], { vendor: 'discord' })

        expect(result).toBeDefined()
    })
})
