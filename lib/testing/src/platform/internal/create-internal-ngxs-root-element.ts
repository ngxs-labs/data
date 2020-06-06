import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ɵgetDOM as getDOM } from '@angular/platform-browser';

export function createInternalNgxsRootElement(): void {
    const document: Document = TestBed.inject(DOCUMENT);
    const root: HTMLElement = getDOM().createElement('app-root', document);
    document.body.appendChild(root);
}
