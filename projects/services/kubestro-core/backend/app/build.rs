use std::process::Command;

fn main() {
    // Get the current Git commit hash
    let output = Command::new("git")
        .args(["rev-parse", "HEAD"])
        .output()
        .expect("Failed to execute git command");

    let git_hash = String::from_utf8(output.stdout).expect("Invalid UTF-8 sequence");

    // Set the environment variable
    println!("cargo:rustc-env=GIT_HASH={}", git_hash.trim());
}
