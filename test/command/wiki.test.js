import Wiki from '../../lib/command/wiki'
import fs from 'fs'
import path from 'path'

describe('command.wiki', () => {
    jest.setTimeout(20000)
    let wiki = new Wiki()

    it('should return correct data from search command', async () => {
        const expectedResult = fs.readFileSync(
            path.join(__dirname, '../__data__/wiki_search.txt'),
            'utf8'
        )
        const result = await wiki.handle(['wiki', 'search', 'javascript'])

        expect(result).toEqual(expectedResult)
    })

    it('should return correct data from id command', async () => {
        const expectedResult = fs.readFileSync(
            path.join(__dirname, '../__data__/wiki_id.txt'),
            'utf8'
        )
        const result = await wiki.handle(['wiki', 'id', '18630637'])

        expect(result).toEqual(expectedResult)
    })

    it('should return correct data from geo command', async () => {
        const expectedResult = fs.readFileSync(
            path.join(__dirname, '../__data__/wiki_geo.txt'),
            'utf8'
        )
        const result = await wiki.handle([
            'wiki',
            'geo',
            '32.329',
            '-96.136',
            '10000'
        ])

        expect(result).toEqual(expectedResult)
    })

    it('should return random data from random command', async () => {
        const result = await wiki.handle(['wiki', 'random'])

        expect(result).toBeDefined()
    })
})
