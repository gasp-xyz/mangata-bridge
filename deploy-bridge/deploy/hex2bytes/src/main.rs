use std::env::args;


fn main(){

	let hex_value: String = args().nth(1).unwrap()[2..].to_string();

	println!("{:?}", format!("{:?}", hex::decode(hex_value).unwrap()));

}
