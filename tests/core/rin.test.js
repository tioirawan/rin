import Rin from '../../src/core/rin'

describe('core.rin', () => {
    it('should correctly standarize a text', () => {
        const text = ' foo      bar BaZ bar    foo      '
        const standarized = Rin.standarize(text)

        expect(standarized).toBe('foo bar baz bar foo')
    })

    it('should correctly convert markdown to telegram html', () => {
        const markdown =
            '__foo__ _baz_ bar_foo baz*bar **bar** :baz: ```foo bar(){return baz}``` `$ foo bar baz`'

        const html = Rin.mdToHtml(markdown)

        expect(html).toBe(
            '<b>foo</b> <em>baz</em> bar_foo baz*bar <b>bar</b> :baz: <code>foo bar(){return baz}</code> <code>$ foo bar baz</code>'
        )
    })

    it('should correctly strip markdown', () => {
        const markdown =
            '__foo__ _baz_ bar_foo baz*bar **bar** ```foo bar(){return baz}``` `$ foo bar baz`'

        const text = Rin.removeMarkdown(markdown)

        expect(text).toBe(
            'foo baz bar_foo baz*bar bar foo bar(){return baz} $ foo bar baz'
        )
    })
})
