import * as Helper from '../../src/core/helper'
import fs from 'fs'

describe('core.rin', () => {
    it('should correctly standarize a text', () => {
        const text = ' foo      bar BaZ bar    foo      '
        const standarized = Helper.standarize(text)

        expect(standarized).toBe('foo bar baz bar foo')
    })

    it('should correctly convert markdown to telegram html', () => {
        const expected = fs.readFileSync(
            __dirname + '/../__data__/rin_mdtohtml.txt',
            'utf8'
        )

        const markdown =
            '__foo__ _baz_ bar_foo baz*bar **bar** ```foo bar(){return baz}``` `$ foo bar baz`'

        const html = Helper.mdToHtml(markdown)

        expect(html).toBe(expected)
    })

    it('should correctly strip markdown', () => {
        const markdown =
            '__foo__ _baz_ bar_foo baz*bar **bar** ```foo bar(){return baz}``` `$ foo bar baz`'

        const text = Helper.removeMarkdown(markdown)

        expect(text).toBe(
            'foo baz bar_foo baz*bar bar foo bar(){return baz} $ foo bar baz'
        )
    })
})
