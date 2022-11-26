
import { Console } from "as-wasi";
import { buff, cmp } from "../assembly";
import { Uart } from '../assembly/uart';

Console.log("Initialising UART");

let d = Uart.init(0, 4000000, -1, -1);

Console.log("UART Write");

let a: u8[] = [0xaa, 0xbb, 0xcc];
d.write(buff(a));

Console.log("UART Read");

let b = new Uint8Array(4);
d.read(b);

let e = buff([0x11, 0x22, 0x33, 0x44]);
Console.log(`Data: ${b} (Expected: ${e})`);
if(!cmp(b, e)) {
    Console.log(`Read mismatch!`);
    assert(false);
}
