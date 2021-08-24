use std::env::args;
use std::fs::OpenOptions;
use std::io::prelude::*;
use sp_core::H160;

fn main(){

	let hex_value: String = args().nth(2).unwrap()[2..].to_string();

	println!("{:?}", format!("{:?}", hex::decode(hex_value).unwrap()));

}
