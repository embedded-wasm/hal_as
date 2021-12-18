
import { Console } from "as-wasi";
import { buff, cmp } from "../assembly";
import { I2c } from '../assembly/i2c';

Console.log("Initialising I2C");

let d = I2c.init(0, 4000000, -1, -1);

Console.log("I2C Write");

let a: u8[] = [0xaa, 0xbb, 0xcc];
d.write(0x0a, buff(a));

Console.log("I2C Read");

let b = new Uint8Array(4);
d.read(0x0a, b);

let e = buff([0x11, 0x22, 0x33, 0x44]);
Console.log(`Data: ${b} (Expected: ${e})`);
if(!cmp(b, e)) {
    Console.log(`Read mismatch!`);
    assert(false);
}

Console.log("I2C WriteRead");

d.write_read(0x0a, buff(a), b);

Console.log(`Data: ${b}`);
assert(cmp(b, buff([0x22, 0x33, 0x44, 0x55])));
