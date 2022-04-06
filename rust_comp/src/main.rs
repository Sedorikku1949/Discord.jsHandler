#!/bin/sh

#![allow(non_snake_case)]
/* LIBRARIES */
use std::process::{Command, Stdio};
use std::{time, env, thread};
use std::io;
use colored::*;

/**
 * Documentation :
 *
 * https://doc.rust-lang.org/std/process/struct.Command.html
 * https://doc.rust-lang.org/std/process/struct.Command.html#method.stdout
 * https://doc.rust-lang.org/std/thread/fn.sleep.html
 * https://doc.rust-lang.org/stable/std/fs/struct.File.html
 */

fn main() -> Result<(), io::Error> {
    // program
    println!("{}", "Starting...".green());
    let mut restart = true;
    let mut i = 0;
    let args: Vec<String> = env::args().collect();
    let mut cmd = Command::new("node");
    for arg in args {
        if i == 0 {
            i += 1;
            continue;
        }
        cmd.arg(arg);
    };
    cmd.stdout(Stdio::inherit()).stdin(Stdio::inherit()).stderr(Stdio::inherit());
    let sleep = time::Duration::from_millis(500);
    let mut last_error = time::Instant::now();

    while restart {
        thread::sleep(sleep);
        // execute nodejs process
        let res = cmd.output().unwrap();
        println!("{}", String::from_utf8_lossy(&res.stderr));
        // restart process if process code is not 0
        println!("\n");
        if res.status.code() == Some(0) {
            restart = false;
        } else {
            let now = time::Instant::now();
            if last_error + time::Duration::from_millis(60000) < now {
                last_error = time::Instant::now();
                i -= 1
            } else { i += 1; };
            if i >= 5 {
                restart = false;
                println!("{}", "Get more than 5 errors in 10m, exit.".red().bold());
            } else {
                println!("{}", "Restarting nodejs process...".red().bold());
            }
        }
    }
    println!("Exit.");
    Ok(())
}