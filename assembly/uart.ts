
import { Console } from "as-wasi";
import { Handle, Bytes, WasiMutPtr } from "./index"

/// UART Device Object
export class Uart {
  private handle: Handle;

  constructor(handle: Handle) {
    this.handle = handle
  }

  /// Initialise a new UART instance with the provided configuration
  public static init(dev: u32, baud: u32, tx: i32, rx: i32): Uart {
    // Allocate storage for returned handle
    let handle = changetype<i32>(__alloc(4));

    Console.log(`as.UART.init initialising device: ${dev} with baud: ${baud} tx: ${tx} rx: ${rx}`);

    let err = uart_init(dev, baud, tx, rx, handle);
    if(err < 0) {
      throw new Error(`as.UART.init error: ${err}`)
    }

    // Load returned value
    let h = load<i32>(handle);

    // Free allocated memory
    __free(handle);

    return new Uart(h);
  }

  /// Write the provided data to the specified peripheral address
  public write(data: Uint8Array): void {
    Console.log(`as.UART.write data: ${data}`);

    let err = uart_write(this.handle, 0, new Bytes(data));
    if(err < 0) {
      throw new Error(`as.UART.write error: ${err}`)
    }

  }

  /// Read from the specified peripheral address
  public read(data: Uint8Array): void {
    Console.log(`as.UART.read`);

    let err = uart_read(this.handle, 0, new Bytes(data));
    if(err < 0) {
      throw new Error(`as.UART.read error: ${err}`)
    }
  }

  /// Deinitialise UART device
  public deinit(): void {
    let err = uart_deinit(this.handle);
    if (err < 0) {
        throw new Error(`as.SPI.deinit error: ${err}`)
    }
    this.handle = -1;
}
}

// External function definitions

// Initialise an UART device
@external("uart", "init")
declare function uart_init(
  device: u32,
  baud: u32,
  tx: i32,
  rx: i32,
  handle: i32,
): i32;

// Write out serial data
@external("uart", "write")
declare function uart_write(
  handle: u32,
  flags: u32,
  data: Bytes,
): i32;

// Read in serial data
@external("uart", "read")
declare function uart_read(
  handle: u32,
  flags: u32,
  buff: Bytes,
): i32;

@external("uart", "deinit")
declare function uart_deinit(
    handle: u32,
): i32;
