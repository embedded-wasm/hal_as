
# Build all components
all: all-tests


# Build tests
TESTS= spi i2c gpio
TEST_BINS:= $(foreach f,$(TESTS),./build/test-$(f).wasm)

all-tests: $(TEST_BINS)

build/test-%.wasm: tests/test_%.ts
	npm exec asc -- $< -o $@



