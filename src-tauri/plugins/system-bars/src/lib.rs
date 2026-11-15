//! Android-only plugin: transparent, edge-to-edge system bars whose icon color
//! follows the app theme, plus the real safe-area insets.
//!
//! The UI calls these commands over IPC; on Android each one forwards to the
//! Kotlin `SystemBarsPlugin` through `run_mobile_plugin_async`.

use serde_json::json;
use tauri::plugin::{Builder, TauriPlugin};
use tauri::{AppHandle, Runtime};

#[cfg(target_os = "android")]
use tauri::plugin::PluginHandle;
#[cfg(target_os = "android")]
use tauri::Manager;

#[cfg(target_os = "android")]
const PLUGIN_IDENTIFIER: &str = "app.tauri.systembars";

pub struct SystemBars<R: Runtime> {
    #[cfg(target_os = "android")]
    handle: PluginHandle<R>,
    #[cfg(not(target_os = "android"))]
    _marker: std::marker::PhantomData<fn() -> R>,
}

/// `theme` is the resolved theme, either `light` or `dark`.
#[tauri::command]
async fn set_theme<R: Runtime>(app: AppHandle<R>, theme: String) -> Result<(), String> {
    #[cfg(target_os = "android")]
    {
        app.state::<SystemBars<R>>()
            .handle
            .run_mobile_plugin_async::<()>("set_theme", json!({ "theme": theme }))
            .await
            .map_err(|error| error.to_string())
    }

    #[cfg(not(target_os = "android"))]
    {
        let _ = (&app, theme);
        Ok(())
    }
}

/// Safe-area insets in dp (CSS pixels) and physical pixels.
#[tauri::command]
async fn get_insets<R: Runtime>(app: AppHandle<R>) -> Result<serde_json::Value, String> {
    #[cfg(target_os = "android")]
    {
        app.state::<SystemBars<R>>()
            .handle
            .run_mobile_plugin_async::<serde_json::Value>("get_insets", ())
            .await
            .map_err(|error| error.to_string())
    }

    #[cfg(not(target_os = "android"))]
    {
        let _ = app;
        Ok(json!({
            "top": 0,
            "bottom": 0,
            "left": 0,
            "right": 0,
            "topPx": 0,
            "bottomPx": 0,
            "leftPx": 0,
            "rightPx": 0
        }))
    }
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("system-bars")
        .invoke_handler(tauri::generate_handler![set_theme, get_insets])
        .setup(|app, api| {
            #[cfg(target_os = "android")]
            {
                let handle = api.register_android_plugin(PLUGIN_IDENTIFIER, "SystemBarsPlugin")?;
                app.manage(SystemBars { handle });
            }

            #[cfg(not(target_os = "android"))]
            let _ = (app, api);

            Ok(())
        })
        .build()
}
