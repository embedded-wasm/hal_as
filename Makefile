

# Default runtime configurations, override using env variables
RUNTIME_DIR?=../target/debug
TEST_DIR?=../spec/tests
RUNTIME_EXEC?=wasmtime

# Generate test listing
TESTS= spi i2c gpio
TEST_BINS:= $(foreach f,$(TESTS),./build/test-$(f).wasm)

# Build all components
all: tests

# Build all tests
tests: $(TEST_BINS)

# Run all tests
test: $(foreach f,$(TESTS),test-$(f))

# Run specific tests
test-%: build/test-%.wasm
	@echo "----------- $(RUNTIME_EXEC)/$@ (config: $(subst test-,,$@).toml) -----------"

	$(RUNTIME_DIR)/wasm-embedded-rt --engine mock --runtime $(RUNTIME_EXEC) --config ${TEST_DIR}/$(subst test-,,$@).toml $<

# Build specific tests
build/test-%.wasm: tests/test_%.ts
	npm exec asc -- $< -o $@

