import Rin, * as Helper from '../../src/core/rin'

describe('core.rin', () => {
    it('should correctly import Rin class', () => {
        expect(Rin).toBeDefined()
    })

    it('should correctly import All Helper', () => {
        expect(Helper).toBeDefined()
        expect(Helper.code).toBeDefined()
        expect(Helper.XOR).toBeDefined()
        expect(Helper.standarize).toBeDefined()
        expect(Helper.sendLogError).toBeDefined()
        expect(Helper.notEmpty).toBeDefined()
        expect(Helper.isEmpty).toBeDefined()
        expect(Helper.getTempPath).toBeDefined()
        expect(Helper.getMaxAllowedLength).toBeDefined()
        expect(Helper.getFileSize).toBeDefined()
        expect(Helper.getChatInfo).toBeDefined()
        expect(Helper.getAvailableCommand).toBeDefined()
        expect(Helper.extractText).toBeDefined()
        expect(Helper.defaultReply).toBeDefined()
        expect(Helper.mdToHtml).toBeDefined()
        expect(Helper.removeMarkdown).toBeDefined()
        expect(Helper.sendLogError).toBeDefined()
    })
})
