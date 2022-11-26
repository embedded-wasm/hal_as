
import { Console } from "as-wasi";
import { Handle, Bytes } from "./index"

/// SPI Device Object
export class Spi {
    private handle: Handle;

    constructor(handle: Handle) {
        this.handle = handle
    }

    /// Initialise a new SPI instance with the provided configuration
    public static init(device: u32, baud: u32, mosi: i32, miso: i32, sck: i32, cs: i32): Spi {
        // Allocate storage for returned handle
        let handle = changetype<i32>(__alloc(4));

        Console.log(`as.Spi.init initialising device: ${device} with baud: ${baud} mosi: ${mosi} miso: ${miso} sck: ${sck} cs: ${cs}`);

        let err = spi_init(device, baud, mosi, miso, sck, cs, handle);
        if (err < 0) {
            throw new Error(`as.Spi.init error: ${err}`)
        }

        // Load returned value
        let h = load<i32>(handle);

        // Free allocated memory
        __free(handle);

        return new Spi(h);
    }

    /// Write data
    public write(data: Uint8Array): void {
        Console.log(`as.SPI.write data: ${data}`);

        let err = spi_write(this.handle, new Bytes(data));
        if (err < 0) {
            throw new Error(`as.SPI.write error: ${err}`)
        }
    }

    /// Read data
    public read(data: Uint8Array): void {
        Console.log(`as.SPI.read data: ${data}`);

        let err = spi_read(this.handle, new Bytes(data));
        if (err < 0) {
            throw new Error(`as.SPI.read error: ${err}`)
        }
    }

    /// Transfer data (simultaneous write/read)
    public transfer_inplace(data: Uint8Array): void {
        Console.log(`as.SPI.transfer data: ${data}`);

        let d = new Bytes(data);

        let err = spi_transfer_inplace(this.handle, d);
        if (err < 0) {
            throw new Error(`as.SPI.transfer error: ${err}`)
        }
    }

    /// Transfer data (simultaneous write/read)
    public transfer(read: Uint8Array, write: Uint8Array): void {
        Console.log(`as.SPI.transfer data: ${write}`);

        let r = new Bytes(read);
        let w = new Bytes(write);

        let err = spi_transfer(this.handle, r, w);
        if (err < 0) {
            throw new Error(`as.SPI.transfer error: ${err}`)
        }
    }

    public deinit(): void {
        let err = spi_deinit(this.handle);
        if (err < 0) {
            throw new Error(`as.SPI.deinit error: ${err}`)
        }
        this.handle = -1;
    }
}


// External function definitions

@external("spi", "init")
declare function spi_init(
    device: u32,
    baud: u32,
    mosi: i32,
    miso: i32,
    sck: i32,
    cs: i32,
    handle: i32,
): i32;

@external("spi", "write")
declare function spi_write(
    handle: u32,
    data: Bytes,
): i32;

@external("spi", "read")
declare function spi_read(
    handle: u32,
    data: Bytes,
): i32;

@external("spi", "transfer_inplace")
declare function spi_transfer_inplace(
    handle: u32,
    buff: Bytes,
): i32;

@external("spi", "transfer")
declare function spi_transfer(
    handle: u32,
    read: Bytes,
    write: Bytes,
): i32;

@external("spi", "deinit")
declare function spi_deinit(
    handle: u32,
): i32;
