use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};

use serde::Deserialize;
use tauri::{AppHandle, Manager, WebviewWindow, WindowEvent};

#[derive(Debug, Deserialize)]
struct NavigateConfig {
    url: String,
    run_after: String,
}

#[tauri::command]
fn navigate(app_handle: AppHandle, config: NavigateConfig) {
    let window: WebviewWindow = app_handle.get_webview_window("main").unwrap();
    window.navigate(config.url.parse().unwrap()).unwrap();
    let flag: Arc<AtomicBool> = Arc::new(AtomicBool::new(false));
    window.on_window_event(move |event| {
        if flag.swap(true, Ordering::Relaxed) {
            return;
        }
        if let WindowEvent::Focused { .. } = event {
            if let Some(window) = app_handle.get_webview_window("main") {
                window.open_devtools();
                window.eval(&config.run_after).unwrap();
            }
        }
    });
}

#[tauri::command]
async fn get(url: String) -> Result<String, String> {
    let client = reqwest::Client::builder()
        .redirect(reqwest::redirect::Policy::limited(10))
        .build()
        .map_err(|e| e.to_string())?;
    let response = client.get(&url).send().await.map_err(|e| e.to_string())?;
    let text = response.text().await.map_err(|e| e.to_string())?;
    Ok(text)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![navigate, get])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
