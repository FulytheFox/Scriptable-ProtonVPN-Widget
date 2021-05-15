// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: share-alt;
// Version 1.0

// For further Information check the RREADME at 'https://github.com/FulytheFox/Scriptable-ProtonVPN-Widget'!

// ----- COLOR-THEME ----- //
let themeMode;
let textColor;

if (Device.isUsingDarkAppearance()) {
    themeMode = 'light';
    textColor = '1E1E1E';
} else {
    themeMode = 'dark';
    textColor = 'EDEDED';
}

// ----- ASSETS-DOWNLOAD ----- //

let fm = FileManager.iCloud();
const pathFolder = fm.joinPath(fm.documentsDirectory(), 'protonVPN');

if (!fm.fileExists(pathFolder)) {
  fm.createDirectory(pathFolder)
  console.log('Directory successfully created.')
}

async function getBG() {
  const pathBG = fm.joinPath(fm.documentsDirectory(), 'bg_' + themeMode + '.jpg');
  
  if (fm.fileExists(pathBG)) {
    return fm.readImage(pathBG)
  } else {
    try {
      let req = new Request('https://raw.githubusercontent.com/FulytheFox/Scriptable-ProtonVPN-Widget/main/assets/bg/bg_' + themeMode + '.jpg')
      let BG = await req.loadImage()
      fm.writeImage(pathBG, BG)
      return BG
    } catch (e) {
      console.error(e)
      return null
    }
  }
}

// ----- WIDGET ----- //
let bgImage = await getBG();
let widget = new ListWidget();

widget.backgroundImage = bgImage
widget.setPadding(10, 10, 10, 10)

if (!config.runsInWidget) {
  await widget.presentSmall()
} else {
  // Tell the system to show the widget.
  Script.setWidget(widget)
  Script.complete()
}
