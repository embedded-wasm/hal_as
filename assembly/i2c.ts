
import { Console } from "as-wasi";
import { Handle, Bytes, WasiMutPtr } from "./index"

/// I2C Device Object
export class I2c {
  private handle: Handle;

  constructor(handle: Handle) {
    this.handle = handle
  }

  /// Initialise a new I2C instance with the provided configuration
  public static init(dev: u32, baud: u32, sda: i32, scl: i32): I2c {
    // Allocate storage for returned handle
    let handle = changetype<i32>(__alloc(4));

    Console.log(`as.I2C.init initialising device: ${dev} with baud: ${baud} sda: ${sda} scl: ${scl}`);

    let err = i2c_init(dev, baud, sda, scl, handle);
    if(err < 0) {
      throw new Error(`as.I2C.init error: ${err}`)
    }

    // Load returned value
    let h = load<i32>(handle);

    // Free allocated memory
    __free(handle);

    return new I2c(h);
  }

  /// Write the provided data to the specified peripheral address
  public write(addr: u8, data: Uint8Array): void {
    Console.log(`as.I2C.write addr: ${addr} data: ${data}`);

    let err = i2c_write(this.handle, addr, new Bytes(data));
    if(err < 0) {
      throw new Error(`as.I2C.write error: ${err}`)
    }

  }

  /// Read from the specified peripheral address
  public read(addr: u8, data: Uint8Array): void {
    Console.log(`as.I2C.read addr: ${addr} data: ${data}`);

    let d = new Bytes(data);

    let err = i2c_read(this.handle, addr, d);
    if(err < 0) {
      throw new Error(`as.I2C.read error: ${err}`)
    }
  }

  /// Write the provided data then read into the buffer using the 
  /// specified peripheral addresss
  public write_read(addr: u8, data: Uint8Array, buff: Uint8Array): void {
    Console.log(`as.I2C.write_read addr: ${addr} data: ${data}`);

    let d = new Bytes(data);
    let b = new Bytes(buff);

    let err = i2c_write_read(this.handle, addr, d, b);
    if(err < 0) {
      throw new Error(`as.I2C.write_read error: ${err}`)
    }
  }

}

// External function definitions

//Initialise an I2C device
@external("i2c", "init")
declare function i2c_init(
  device: u32,
  baud: u32,
  sda: i32,
  scl: i32,
  handle: i32,
): i32;

@external("i2c", "write")
declare function i2c_write(
  handle: u32,
  addr: u8,
  data: Bytes,
): i32;

@external("i2c", "read")
declare function i2c_read(
  handle: u32,
  addr: u8,
  buff: Bytes,
): i32;

@external("i2c", "write_read")
declare function i2c_write_read(
  handle: u32,
  addr: u8,
  data: Bytes,
  buff: Bytes,
): i32;