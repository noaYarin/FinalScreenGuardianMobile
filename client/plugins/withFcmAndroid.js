const { withAndroidManifest, withMainApplication, withStringsXml } = require("@expo/config-plugins");

function ensureUsesPermission(androidManifest, permissionName) {
  androidManifest.manifest["uses-permission"] ??= [];
  const perms = androidManifest.manifest["uses-permission"];
  const exists = perms.some((p) => p?.$?.["android:name"] === permissionName);
  if (!exists) perms.push({ $: { "android:name": permissionName } });
}

// Inserts or updates a <meta-data> tag within the <application> tag of the AndroidManifest
function upsertMetaData(application, name, value) {
  application["meta-data"] ??= [];
  const items = application["meta-data"];
  const existing = items.find((m) => m?.$?.["android:name"] === name);
  if (existing) {
    existing.$["android:value"] = value;
  } else {
    items.push({ $: { "android:name": name, "android:value": value } });
  }
}

function upsertString(strings, name, value) {
  strings.resources.string ??= [];
  const items = strings.resources.string;
  const existing = items.find((s) => s?.$?.name === name);
  if (existing) {
    existing._ = value;
  } else {
    items.push({ $: { name }, _: value });
  }
}

// Primary Expo Config Plugin to configure Android FCM settings, notification channels, and permissions
module.exports = function withFcmAndroid(config) {
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    ensureUsesPermission(androidManifest, "android.permission.POST_NOTIFICATIONS");

    const app = androidManifest.manifest.application?.[0];
    if (app) {
      app.$["android:usesCleartextTraffic"] = "true";

      upsertMetaData(
        app,
        "com.google.firebase.messaging.default_notification_channel_id",
        "@string/default_notification_channel_id"
      );
    }

    return config;
  });

  config = withStringsXml(config, (config) => {
    const strings = config.modResults;
    upsertString(strings, "default_notification_channel_id", "default");
    upsertString(strings, "default_notification_channel_name", "General");
    return config;
  });

  config = withMainApplication(config, (config) => {
    let src = config.modResults.contents;

    if (!src.includes("ensureDefaultNotificationChannel")) {
      if (!src.includes("import android.app.NotificationChannel")) {
        src = src.replace(
          "import android.app.Application",
          [
            "import android.app.NotificationChannel",
            "import android.app.NotificationManager",
            "import android.app.Application",
            "import android.content.Context",
            "import android.os.Build",
          ].join("\n")
        );
      }

      src = src.replace(
        /class\s+MainApplication\s*:\s*Application\(\),\s*ReactApplication\s*\{/,
        (match) =>
          [
            match,
            "",
            "  private fun ensureDefaultNotificationChannel() {",
            "    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return",
            "    val channelId = getString(R.string.default_notification_channel_id)",
            "    val channelName = getString(R.string.default_notification_channel_name)",
            "    val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager",
            "    val existing = manager.getNotificationChannel(channelId)",
            "    if (existing != null) return",
            "    val channel = NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_DEFAULT)",
            "    manager.createNotificationChannel(channel)",
            "  }",
            "",
          ].join("\n")
      );

      src = src.replace(
        /override\s+fun\s+onCreate\(\)\s*\{\s*\n\s*super\.onCreate\(\)\s*\n/,
        (match) => match + "    ensureDefaultNotificationChannel()\n"
      );
    }

    config.modResults.contents = src;
    return config;
  });

  return config;
};

