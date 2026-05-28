package com.screenguardianmobile

/**
 * MainApplication
 *
 * This is the main Application class for the Android app.
 * It is responsible for initializing the React Native runtime and configuring
 * the native environment when the app process starts.
 *
 * Main responsibilities:
 * - Create and configure the React Native host.
 * - Register all React Native packages used by the app.
 * - Manually register custom native packages such as DeviceControlPackage.
 * - Load the React Native engine when the application starts.
 * - Integrate Expo lifecycle handling with Expo modules and lifecycle events correctly.
 */

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Application
import android.os.Build
import android.content.Context
import android.content.res.Configuration
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.ReactHost
import com.facebook.react.common.ReleaseLevel
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactNativeHost

import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost = ReactNativeHostWrapper(
    this,
    object : DefaultReactNativeHost(this) {
      override fun getPackages(): List<ReactPackage> =
        PackageList(this).packages.apply {
          // Manually register our custom native package
          add(DeviceControlPackage())
        }

      override fun getJSMainModuleName(): String = ".expo/.virtual-metro-entry"

      override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

      override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
    }
  )

  override val reactHost: ReactHost
    get() = ReactNativeHostWrapper.createReactHost(applicationContext, reactNativeHost)

  private fun ensureNotificationChannels() {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

    val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    val defaultChannelId = getString(R.string.default_notification_channel_id)
    val defaultChannelName = getString(R.string.default_notification_channel_name)

    if (manager.getNotificationChannel(defaultChannelId) == null) {
      val defaultChannel = NotificationChannel(
        defaultChannelId,
        defaultChannelName,
        NotificationManager.IMPORTANCE_DEFAULT
      ).apply {
        description = "General app notifications"
        enableVibration(true)
      }

      manager.createNotificationChannel(defaultChannel)
    }

    val sosChannelId = "sos_alerts"

    if (manager.getNotificationChannel(sosChannelId) == null) {
      val sosChannel = NotificationChannel(
        sosChannelId,
        "SOS alerts",
        NotificationManager.IMPORTANCE_HIGH
      ).apply {
        description = "Urgent SOS alerts from your child"
        enableVibration(true)
        vibrationPattern = longArrayOf(0, 500, 250, 500, 250, 800)
        lockscreenVisibility = android.app.Notification.VISIBILITY_PUBLIC
      }

      manager.createNotificationChannel(sosChannel)
    }
  }

  override fun onCreate() {
    super.onCreate()

    ensureNotificationChannels()

    DefaultNewArchitectureEntryPoint.releaseLevel = try {
      ReleaseLevel.valueOf(BuildConfig.REACT_NATIVE_RELEASE_LEVEL.uppercase())
    } catch (e: IllegalArgumentException) {
      ReleaseLevel.STABLE
    }

    loadReactNative(this)
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }
}