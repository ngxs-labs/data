import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

export function removeInternalNgxsRootElement(): void {
    const document: Document = TestBed.inject(DOCUMENT);
    const root: Element = document.getElementsByTagName('app-root').item(0)!;
    try {
        document.body.removeChild(root);
    } catch {}
}
