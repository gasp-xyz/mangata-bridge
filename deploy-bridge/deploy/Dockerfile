FROM rust

RUN echo deb http://ftp.us.debian.org/debian testing main contrib non-free >> /etc/apt/sources.list

RUN apt-get update && apt-get install -y cmake pkg-config libssl-dev git build-essential clang libclang-dev curl llvm

RUN rustup default stable

RUN rustup install nightly-2020-10-01
RUN rustup default nightly-2020-10-01
RUN rustup target add wasm32-unknown-unknown --toolchain nightly-2020-10-01
