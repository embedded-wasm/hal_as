
import { Console } from "as-wasi";
import { buff, cmp } from "../assembly";
import { Gpio } from '../assembly/gpio';

Console.log("Initialising GPIO output");
let o = Gpio.output(2, 3);

Console.log("GPIO set");
o.set(true);

Console.log("Initialising GPIO input");
let i = Gpio.input(2, 4);

Console.log("GPIO get");
let v = i.get();

assert(v == false)
