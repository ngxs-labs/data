import { uuidv4 } from '@ngxs-labs/data/utils';

describe('[TEST]: Entity uuidv4', () => {
    it('should be correct generate uui', () => {
        expect(uuidv4()).toEqual(expect.any(String));
        expect(uuidv4()).not.toEqual(uuidv4());
        expect(uuidv4().length).toEqual(36);
        expect(uuidv4().split('-')).toEqual([
            expect.any(String),
            expect.any(String),
            expect.any(String),
            expect.any(String),
            expect.any(String)
        ]);
    });
});
