import { actionMatcher, ActionType, InitState, UpdateState } from '@ngxs/store';

export function isInitAction(action: ActionType): boolean {
    const matches: (action: ActionType) => boolean = actionMatcher(action);
    return matches(InitState) || matches(UpdateState);
}
