export default class Rin {
    telegramize(str) {
        return str
            .replace(/\s*:.*?:\s*/g, '') // foo :bar: -> foo
            .replace(/\*\*+/g, '*') // **foo** -> *foo*
            .replace(/__+/g, '_') // __foo__ -> _foo_
    }
}
