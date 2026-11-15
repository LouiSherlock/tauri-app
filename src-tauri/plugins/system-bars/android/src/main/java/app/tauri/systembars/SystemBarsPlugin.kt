package app.tauri.systembars

import android.app.Activity
import android.graphics.Color
import android.os.Build
import android.webkit.WebView
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.Plugin

@InvokeArg
class ThemeArgs {
  lateinit var theme: String
}

/**
 * Paints the window edge-to-edge so the web page background runs behind the
 * system bars, and keeps the bar icons readable for the active theme.
 *
 * These methods are reached from Rust's `run_mobile_plugin_async`, not directly
 * from the WebView; the plugin's `set_theme` / `get_insets` commands forward.
 */
@TauriPlugin
class SystemBarsPlugin(private val activity: Activity) : Plugin(activity) {

  override fun load(webView: WebView) {
    super.load(webView)

    activity.runOnUiThread {
      WindowCompat.setDecorFitsSystemWindows(activity.window, false)
      activity.window.statusBarColor = Color.TRANSPARENT
      activity.window.navigationBarColor = Color.TRANSPARENT

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        activity.window.isStatusBarContrastEnforced = false
        activity.window.isNavigationBarContrastEnforced = false
      }
    }
  }

  @Command
  fun set_theme(invoke: Invoke) {
    val args = invoke.parseArgs(ThemeArgs::class.java)

    val useDarkIcons = when (args.theme) {
      "light" -> true
      "dark" -> false
      else -> {
        invoke.reject("Unknown theme: ${args.theme}")
        return
      }
    }

    activity.runOnUiThread {
      val controller = WindowInsetsControllerCompat(
        activity.window,
        activity.window.decorView
      )

      // true = dark icons for a light background, false = light icons.
      controller.isAppearanceLightStatusBars = useDarkIcons
      controller.isAppearanceLightNavigationBars = useDarkIcons

      invoke.resolve()
    }
  }

  /**
   * Safe-area insets in dp (what the WebView uses for CSS pixels) and physical
   * pixels. `WindowInsetsCompat` accounts for cutouts, rotation and display
   * scaling.
   */
  @Command
  fun get_insets(invoke: Invoke) {
    activity.runOnUiThread {
      val safeInsets = ViewCompat.getRootWindowInsets(activity.window.decorView)
        ?.getInsets(
          WindowInsetsCompat.Type.systemBars() or
            WindowInsetsCompat.Type.displayCutout()
        )

      val density = activity.resources.displayMetrics.density

      val topPx = safeInsets?.top ?: 0
      val bottomPx = safeInsets?.bottom ?: 0
      val leftPx = safeInsets?.left ?: 0
      val rightPx = safeInsets?.right ?: 0

      invoke.resolveObject(
        mapOf(
          "top" to topPx / density,
          "bottom" to bottomPx / density,
          "left" to leftPx / density,
          "right" to rightPx / density,
          "topPx" to topPx,
          "bottomPx" to bottomPx,
          "leftPx" to leftPx,
          "rightPx" to rightPx
        )
      )
    }
  }
}
