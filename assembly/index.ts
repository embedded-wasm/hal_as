/// embedded-wasm AssemblyScript Library

import "wasi";


export type Handle = i32;

export type WasiMutPtr<T> = usize;
export type WasiPtr<T> = usize;


export class Bytes {
    public ptr: i32;
    public len: u32;

    constructor(data: Uint8Array) {
        this.ptr = changetype<i32>(data.dataStart);
        this.len = data.length;
    }
}

/// Helper to create a Uint8Array object from u8[] (Array<u8>) data
export function buff(data: u8[]): Uint8Array {
    let d = new Uint8Array(data.length);
    for(let i=0; i<data.length; i++) {
        d[i] = data[i];
    }
    return d;
}

/// Helper to compare two typed arrays
export function cmp(a: Uint8Array, b: Uint8Array): bool {
    if (a.length !== b.length) {
        return false;
    }
    for (let i=0; i<a.length; i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}
