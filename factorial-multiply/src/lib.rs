#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }

    #[test]
    fn test_fact_multiply() {
        let val = fact_multiply(5, 2);
        assert_eq!(val, 240);
    }

    #[test]
    fn test_fact_multiply_2() {
        let val = fact_multiply(19, 1);
        assert_eq!(val, 121645100408832000);
    }
/*
    #[test]
    fn test_fact_multiply_3() {
        let val = fact_multiply(44, 1);
	let exp: usize = 2658271574788448768043625811014615890319638528000000000;
        assert_eq!(val, exp);
    } */
}

use std::ffi::CString;
use std::mem;
use std::os::raw::{c_char, c_void};

#[no_mangle]
pub extern fn alloc(size: usize) -> *mut c_void {
    let mut buf = Vec::with_capacity(size);
    let ptr = buf.as_mut_ptr();
    mem::forget(buf);
    return ptr as *mut c_void;
}

#[no_mangle]
pub extern fn dealloc_str(ptr: *mut c_char) {
    unsafe {
        let _ = CString::from_raw(ptr);
    }
}

#[no_mangle]
pub extern fn fact(n: u32) -> u64 {
    let mut n = n as u64;
    let mut result = 1;
    while n > 0 {
        result = result * n;
        n = n - 1;
    }
    result
}

#[no_mangle]
pub extern fn fact_multiply(n:u32, p: u32) -> u64 {
    let factorial_number = fact(n);
    factorial_number * (p as u64)
}

/*
#[no_mangle]
pub extern fn fact_multiply_str(n: u32, p: u32) -> u128 {
	fact_multiply(n, p)
}
*/


#[no_mangle]
pub extern fn fact_multiply_str(n: u32, p: u32) -> *mut c_char {
    let res = fact_multiply(n, p);
    let s = format!("{}", res);
    let result = CString::new(s).unwrap();
    result.into_raw()
}

#[no_mangle]
pub extern fn sample_test(n: u32) -> u32 {
     n * n
}
