//! The desktop app: Tauri commands over `app-core`. The window only shows what these answer; the
//! work happens in the core.

use app_core::Greeting;

/// Greets `name`. A command converts between the core and the front end, and does nothing else.
#[tauri::command]
fn greet(name: &str) -> Greeting {
    app_core::greet(name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init());
    #[cfg(desktop)]
    let builder = builder
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build());
    builder
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("the app failed to start");
}
