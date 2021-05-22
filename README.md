# ProtonVPN Status Widget for Scriptable

An unofficial script for iOS 14 widgets that shows you your current connection to ProtonVPN servers.

> ⚠ The server data of ProtonVPN-API may be larger than other widgets. I'm trying to find a more data-efficient way to query the status of the servers. If you notice increased data consumption after installing the script, it's probably because of that!



## Preview

Darkmode - Connected | Darkmode - Not connected | Lightmode - Connected | Lightmode - Not connected
------------ | ------------- | ------------- | -------------
![widget_preview_connected_dark](https://raw.githubusercontent.com/FulytheFox/Scriptable-ProtonVPN-Widget/main/assets/preview/widget_preview_connected_dark.png) | ![widget_preview_disconnected_dark](https://raw.githubusercontent.com/FulytheFox/Scriptable-ProtonVPN-Widget/main/assets/preview/widget_preview_disconnected_dark.png) | ![widget_preview_connected_light](https://raw.githubusercontent.com/FulytheFox/Scriptable-ProtonVPN-Widget/main/assets/preview/widget_preview_connected_light.png) | ![widget_preview_disconnected_light](https://raw.githubusercontent.com/FulytheFox/Scriptable-ProtonVPN-Widget/main/assets/preview/widget_preview_disconnected_light.png)

## Requirements

For the script to work you need a device with iOS 14 or higher and the [Scriptable](https://scriptable.app/) app.

## Installation

1. Copy all the code from the file [ProtonVPN_Status.js](https://github.com/FulytheFox/Scriptable-ProtonVPN-Widget/ProtonVPN_Status.js) which is located in the repository.
2. Open Scriptable and tap on `+` in the top right corner.
5. Paste the copied code.
6. If you wish you can now configure `hideIP` and `useiCloud` at the very top of the script. If you want you can also change the colors in the script. Tap `Done`.
7. Now go to your homescreen and enter the wiggle-mode. Then add a new scriptable-widget and edit it. Select the `ProtonVPN Status`-script under `Script` and it should work!

## Links

### APIs used for this project:
* [ProtonVPN-API](https://api.protonvpn.ch/vpn/logicals)
* [REST Countries](https://restcountries.eu/)

### Logos used for this project:

* [ProtonVPN - Press / Media Kit](https://protonvpn.com/press)
* Country flags - All flags are made by the Contributors of this project. However, we have used the `195 Flat Flags Pack` made by [Muharrem Şenyıl](https://senyil.com/) to reconstruct the flags in Illustrator.

## Contribution

If you found any bugs, ideas or suggestions for the script, please let me know in the [Issues](https://github.com/FulytheFox/Scriptable-ProtonVPN-Widget/issues)-Tab. I am happy about new suggestions!
