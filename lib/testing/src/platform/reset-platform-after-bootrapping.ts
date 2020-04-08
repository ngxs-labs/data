import { createPlatform, destroyPlatform } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { removeInternalNgxsRootElement } from './internal/remove-internal-ngxs-root-element';

export function resetPlatformAfterBootstrapping(): void {
    removeInternalNgxsRootElement();
    destroyPlatform();
    createPlatform(TestBed);
}
