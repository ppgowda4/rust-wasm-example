((function(){
  console.log('loading...');
  window.WASMModule = {};

function copyCStr(module, ptr) {
  let orig_ptr = ptr;
  const collectCString = function* () {
    let memory = new Uint8Array(module.memory.buffer);
    while (memory[ptr] !== 0) {
      if (memory[ptr] === undefined) { throw new Error("Tried to read undef mem") }
      yield memory[ptr]
      ptr += 1
    }
  }

  const buffer_as_u8 = new Uint8Array(collectCString())
  const utf8Decoder = new TextDecoder("UTF-8");
  const buffer_as_utf8 = utf8Decoder.decode(buffer_as_u8);
  module.dealloc_str(orig_ptr);
  return buffer_as_utf8
}

function jsFact(q) {
var val = 1

while(q > 0) {
val = val * q;
q = q - 1;
}
return val;
}

  fetch('./factorial-multiply/target/wasm32-unknown-unknown/release/factorial_multiply_small.wasm')
  .then(response => response.arrayBuffer())
  .then(bytes => WebAssembly.instantiate(bytes, {}))
  .then(mod => {
		WASMModule.fact = mod.instance.exports.fact;
		WASMModule.fact_multiply  = mod.instance.exports.fact_multiply;
      	WASMModule.alloc = mod.instance.exports.alloc;
      	WASMModule.dealloc_str = mod.instance.exports.dealloc_str;
      	WASMModule.memory = mod.instance.exports.memory;
      	WASMModule.fact_multiply_str = function(n, p) {
        	let outptr = mod.instance.exports.fact_multiply_str(n, p);
        	let result = copyCStr(mod.instance.exports, outptr);
        	return result;
      	}

		WASMModule.sample_test = function(n) {
        	return mod.instance.exports.sample_test(n);
      	}

console.log('js val', jsFact(20));
	console.log('factorial of 5 ', WASMModule.fact_multiply_str(5, 1));
console.log('factorial of 20 ', WASMModule.fact_multiply_str(20, 1));
    console.log('!5 * 2 = ', WASMModule.fact_multiply_str(5, 2));
    console.log('multi test', WASMModule.sample_test(10));
  }).catch(err=>console.log(err));
})())
