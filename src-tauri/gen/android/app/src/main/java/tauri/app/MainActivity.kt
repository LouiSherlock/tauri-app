package tauri.app

import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.webkit.WebView
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : TauriActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // Edge-to-edge; the bar icons are owned by the system-bars plugin so they
    // follow the app theme instead of being pinned to the system theme.
    WindowCompat.setDecorFitsSystemWindows(window, false)
    window.statusBarColor = Color.TRANSPARENT
    window.navigationBarColor = Color.TRANSPARENT

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
      window.isNavigationBarContrastEnforced = false
      window.isStatusBarContrastEnforced = false
    }

    setupSafeAreaBridge()
  }

  private fun setupSafeAreaBridge() {
    val contentView = findViewById<View>(android.R.id.content)

    ViewCompat.setOnApplyWindowInsetsListener(contentView) { view, insets ->
      val safeInsets = insets.getInsets(
        WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout()
      )
      val density = resources.displayMetrics.density
      val top = safeInsets.top / density
      val bottom = safeInsets.bottom / density
      val left = safeInsets.left / density
      val right = safeInsets.right / density

      view.post {
        findWebView(view)?.evaluateJavascript(
          """
          (() => {
            const root = document.documentElement;
            root.style.setProperty('--native-safe-area-top', '${top}px');
            root.style.setProperty('--native-safe-area-bottom', '${bottom}px');
            root.style.setProperty('--native-safe-area-left', '${left}px');
            root.style.setProperty('--native-safe-area-right', '${right}px');
          })();
          """.trimIndent(),
          null
        )
      }

      insets
    }

    ViewCompat.requestApplyInsets(contentView)
  }

  private fun findWebView(view: View): WebView? {
    if (view is WebView) return view
    if (view is ViewGroup) {
      for (index in 0 until view.childCount) {
        findWebView(view.getChildAt(index))?.let { return it }
      }
    }
    return null
  }
}
