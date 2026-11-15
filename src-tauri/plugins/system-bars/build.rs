const COMMANDS: &[&str] = &["set_theme", "get_insets"];

fn main() {
    tauri_plugin::Builder::new(COMMANDS)
        .android_path("android")
        .build();
}
