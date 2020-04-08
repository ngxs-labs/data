import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { ɵgetDOM as getDOM } from '@angular/platform-browser';

export function removeInternalNgxsRootElement(): void {
    const document: Document = TestBed.get(DOCUMENT);
    const root: HTMLElement = getDOM().querySelector(document, 'app-root');
    try {
        document.body.removeChild(root);
    } catch {}
}
