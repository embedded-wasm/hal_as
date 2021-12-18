
import { Console} from "as-wasi";
import { buff, cmp } from "../assembly";
import { Spi } from '../assembly/spi';

Console.log("Initialising SPI");

let d = Spi.init(0, 4000000, -1, -1, -1, -1);


Console.log("SPI Write");

let a: u8[] = [0xaa, 0xbb, 0xcc];
d.write(buff(a));


Console.log("SPI Transfer");

let b: u8[] = [0xaa, 0xbb, 0xcc, 0xdd];
let c = buff(b);

d.transfer(c);

Console.log(`RX: ${c}`);
assert(cmp(c, buff([0x11, 0x22, 0x33, 0x44])));

d.deinit();
