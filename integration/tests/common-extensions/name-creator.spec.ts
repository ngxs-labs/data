/* eslint-disable */
import { actionNameCreator, MethodArgsRegistry } from '@ngxs-labs/data/internals';

describe('[TEST]: actionNameCreator', () => {
    it('should be correct', () => {
        expect(actionNameCreator({ stateName: 'A', methodName: 'a', argumentsNames: [] })).toEqual('@A.a()');

        expect(actionNameCreator({ stateName: 'A', methodName: 'a', argumentsNames: ['x', 'y', 'z'] })).toEqual(
            '@A.a($arg0, $arg1, $arg2)'
        );
    });

    it('should be correct create payload type by payload and name', () => {
        const registry: MethodArgsRegistry = new MethodArgsRegistry();
        registry.createPayloadType('X', 'a', 0);
        registry.createArgumentName('Z', 'a', 2);

        expect(
            actionNameCreator({
                stateName: 'A',
                methodName: 'a',
                argumentsNames: ['x', 'y', 'z'],
                argumentRegistry: registry
            })
        ).toEqual('@A.a(X, $arg1, Z)');
    });

    it('should be correct create payload type when override type by name', () => {
        const registry: MethodArgsRegistry = new MethodArgsRegistry();
        registry.createPayloadType('X', 'a', 0);
        registry.createArgumentName('_X_', 'a', 0);
        registry.createArgumentName('Z', 'a', 2);

        expect(
            actionNameCreator({
                stateName: 'A',
                methodName: 'a',
                argumentsNames: ['x', 'y', 'z'],
                argumentRegistry: registry
            })
        ).toEqual('@A.a(_X_, $arg1, Z)');
    });
});
