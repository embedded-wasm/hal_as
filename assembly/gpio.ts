
import { Console } from "as-wasi";
import { Handle, Bytes, WasiMutPtr } from "./index"

/// GPIO Device Object
export class Gpio {
  private handle: Handle;

  constructor(handle: Handle) {
    this.handle = handle
  }

  /// Initialise a new GPIO instance with the provided configuration
  static init(port: u32, pin: u32, mode: u32): Gpio {
    // Allocate storage for returned handle
    let handle = changetype<i32>(__alloc(4));

    Console.log(`as.GPIO.init initialising port: ${port} pin: ${pin} mode: ${mode}`);

    let err = gpio_init(port, pin, mode, handle);
    if(err < 0) {
      throw new Error(`as.GPIO.init error: ${err}`)
    }

    // Load returned value
    let h = load<i32>(handle);

    // Free allocated memory
    __free(handle);

    return new Gpio(h);
  }

  /// Initialise an output pin
  public static output(port: u32, pin: u32): Gpio {
      return this.init(port, pin, 1)
  }

  /// Initialise an input pin
  public static input(port: u32, pin: u32): Gpio {
    return this.init(port, pin, 0)
  }

  /// Write the provided data to the specified peripheral address
  public set(state: bool): void {
    Console.log(`as.GPIO.write state: ${state}`);

    let err = gpio_set(this.handle, state ? 1 : 0);
    if(err < 0) {
      throw new Error(`as.GPIO.write error: ${err}`)
    }

  }

  /// Read from the specified peripheral address
  public get(): bool {
    Console.log(`as.GPIO.get`);

    let value = changetype<u32>(__alloc(4));

    let err = gpio_get(this.handle, value);
    if(err < 0) {
      throw new Error(`as.GPIO.read error: ${err}`)
    }

    let v = load<u32>(value);;
    __free(value)

    return v != 0;
  }

}

// External function definitions

//Initialise an GPIO device
@external("gpio", "init")
declare function gpio_init(
  port: u32,
  pin: u32,
  mode: u32,
  handle: i32,
): i32;


@external("gpio", "deinit")
declare function gpio_deinit(
  handle: i32,
): i32;

@external("gpio", "set")
declare function gpio_set(
  handle: i32,
  value: u32,
): i32;

@external("gpio", "get")
declare function gpio_get(
  handle: i32,
  value: u32,
): i32;
