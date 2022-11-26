
import { Console} from "as-wasi";
import { buff, cmp } from "../assembly";
import { Spi } from '../assembly/spi';

Console.log("Initialising SPI");

let device = Spi.init(0, 4000000, -1, -1, -1, -1);


Console.log("SPI Write");

let a: u8[] = [0xaa, 0xbb, 0xcc];
device.write(buff(a));


Console.log("SPI Read");

let b: u8[] = [0x00, 0x00, 0x00, 0x00, 0x00];
let b1 = buff(b);
device.read(b1);
assert(cmp(b1, buff([0xab, 0xab, 0xab, 0xab, 0xab])));


Console.log("SPI Transfer In Place");

let c: u8[] = [0xaa, 0xbb, 0xcc, 0xdd];
let c1 = buff(c);
device.transfer_inplace(c1);

Console.log(`RX: ${c}`);
assert(cmp(c1, buff([0x11, 0x22, 0x33, 0x44])));


Console.log("SPI Transfer");

let w: u8[] = [0xaa, 0xbb, 0xcc, 0xdd];
let w1 = buff(w);
let r: u8[] = [0x00, 0x00, 0x00, 0x00];
let r1 = buff(r);

device.transfer(r1, w1);

Console.log(`RX: ${r1}`);
assert(cmp(r1, buff([0x11, 0x22, 0x33, 0x44])));


Console.log("SPI Deinit");

device.deinit();
