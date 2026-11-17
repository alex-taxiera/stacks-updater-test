//! What the apps do, without their windows: the logic Tauri commands call, tested on its own.

use serde::Serialize;
use ts_rs::TS;

/// What `greet` answers. ts-rs writes it to TypeScript for the front end (`pnpm bindings`).
#[derive(Debug, Clone, PartialEq, Eq, Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct Greeting {
    pub message: String,
}

/// Greets `name`, or the world when it's blank.
pub fn greet(name: &str) -> Greeting {
    let name = name.trim();
    let name = if name.is_empty() { "world" } else { name };
    Greeting {
        message: format!("Hello, {name}!"),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn greets_by_name() {
        assert_eq!(greet(" Ada ").message, "Hello, Ada!");
    }

    #[test]
    fn greets_the_world_when_nobody_is_named() {
        assert_eq!(greet("  ").message, "Hello, world!");
    }

    #[test]
    fn serializes_as_the_front_end_reads_it() {
        let json = serde_json::to_value(greet("Ada")).unwrap();
        assert_eq!(json, serde_json::json!({ "message": "Hello, Ada!" }));
    }
}
