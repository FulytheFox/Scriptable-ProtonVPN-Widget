// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: share-alt;
// Version 1.1

// For further Information check the README at 'https://github.com/FulytheFox/Scriptable-ProtonVPN-Widget'!

// ----- CONFIGURATION ----- //
let hideIP = false; // Default is false / If this variable is set to true, your IP address will be hidden as long as you are not connected to any server. This is useful if you often share your screen with others.
let useiCloud = true; // Default is true / Change this variable to false if you don't use iCloud Drive.

// ----- COLOR-THEME ----- //
let themeMode;
let textColor;
let loadColor = '#56b366'; // Default is green / The color of the shield and circle when the server-load is under 50%.

if (Device.isUsingDarkAppearance()) {
    themeMode = 'dark';
    textColor = 'EDEDED'; // Default is white / The color of the text in darkmode.
} else {
    themeMode = 'light';
    textColor = '1E1E1E'; // Default is dark-gray / The color of the text in lightmode.
}

// ----- VARIABLES ----- //
let clientIP = await getIP('ip');
let clientCountry = await getIP('country');

let serverLoad = 0;
let serverName = clientCountry;
let serverCity = "N/A";
let serverCountry = clientCountry;
let serverCountryFull = await getCountryName(serverCountry);
let serverConnected = false;

// ----- GET-ASSETS ----- //
let fm = useiCloud == true ? FileManager.iCloud() : FileManager.local();
let fml = FileManager.local();
const pathFolder = fm.joinPath(fm.documentsDirectory(), 'protonVPN_Widget');

if (!fm.fileExists(pathFolder)) {
  fm.createDirectory(pathFolder)
  console.log('Directory successfully created.')
}

async function getLogo() {
  const pathLogo = fm.joinPath(pathFolder, 'protonvpn_logo.png');
  
  if (fm.fileExists(pathLogo)) {
    return fm.readImage(pathLogo)
  } else {
    try {
      let req = new Request('https://raw.githubusercontent.com/FulytheFox/Scriptable-ProtonVPN-Widget/main/assets/logo/protonvpn-sign-green.png')
      let Logo = await req.loadImage()
      fm.writeImage(pathLogo, Logo)
      return Logo
    } catch (e) {
      console.error(e)
      return null
    }
  }
}

async function getBG() {
  const pathBG = fm.joinPath(pathFolder, 'bg_' + themeMode + '.jpg');
  
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

async function getFlag() {
  let pathFlag = fm.joinPath(fml.temporaryDirectory(), 'flag_' + serverCountry + '.png');
  let reqURL = 'https://raw.githubusercontent.com/FulytheFox/Scriptable-ProtonVPN-Widget/main/assets/flags/flag_' + serverCountry + '.png'

  if (!serverConnected) {
    pathFlag = fm.joinPath(fml.temporaryDirectory(), 'flag_no_connection.png');
    reqURL = 'https://raw.githubusercontent.com/FulytheFox/Scriptable-ProtonVPN-Widget/main/assets/flags/flag_no_connection.png'
  }

  if (fml.fileExists(pathFlag)) {
    return fml.readImage(pathFlag)
  } else {
    try {
      let req = new Request(reqURL)
      let flag = await req.loadImage()
      fml.writeImage(pathFlag, flag)
      return flag
    } catch (e) {
      console.log("Could not load flag from Github.\n" + e)
      return null
    }
  }
}

// ----- GET-SERVER-DATA ----- //
async function getIP(v) {
  try {
    let req = new Request('https://api.protonvpn.ch/vpn/location')
    let data = await req.loadJSON()
    let ip = data.IP
    let country = data.Country

    if (v == 'country') {
      console.log('Client Country: ' + country)
      return country
    }

    console.log('Client IP: ' + ip)
    return ip
  } catch (error) {
    throw new Error('An error occurred when loading your IP-Address from the ProtonVPN API. Please check your Internet Connection.')
  }
}

async function getCountryName(code) {
  let countryCode = code == 'GB' ? 'UK' : code;
  
  try {
    let req = new Request('https://restcountries.eu/rest/v2/alpha/' + countryCode)
    let data = await req.loadJSON()
    let name = data.name
    console.log('Server Country: ' + name)
    return name
  } catch (error) {
    throw new Error('An error occurred when loading Countrynames from the Restcountries API. Please check your Internet Connection.')
  }
}

async function getServerData() {
  try {
    let req = new Request('https://api.protonvpn.ch/vpn/logicals')
    let data = await req.loadJSON()
    
    console.log("Searching for connected server...")

    var i;
    for (i = 0; i < data.LogicalServers.length; i++) {
      let serverIP = data.LogicalServers[i].Servers[0].ExitIP;
      
      if (serverIP == clientIP) {
        console.log("Server found! IP: " + serverIP);

        let server = data.LogicalServers[i];

        serverLoad = server.Load;
        serverName = server.Name;
        serverCity = server.City;
        serverCountry = server.ExitCountry;
        serverCountryFull = await getCountryName(serverCountry);
        serverConnected = true;

        break;
      }
    }
  } catch (error) {
    throw new Error('An error occurred when loading data from the ProtonVPN API. Please check your Internet Connection.\n' + error)
  }
}

// ----- WIDGET-INIT ----- //
await getServerData();

if (!serverConnected) {
  console.log("Client is not connected to any server. Accesses placeholders...")
  if (hideIP) {
    clientIP = "IP hidden"
    console.log("hideIP is active.")
  }
}

if (!serverConnected || serverLoad >= 90)
  loadColor = '#ED5565' // Default is red / The color of the shield and circle when the server-load is over 90%.
else if (serverLoad >= 50)
  loadColor = '#F6BB42' // Default is yellow / The color of the shield and circle when the server-load is between 50% and 89%.

let bgImage = await getBG();
let protonLogo = await getLogo();
let flag = await getFlag();

let widget = new ListWidget();

widget.backgroundImage = bgImage
widget.setPadding(12, 12, 10, 12)
widget.url = 'protonvpn://'

stack1 = widget.addStack()
stack1.centerAlignContent()

// ----- WIDGET-LOGO ----- //
if (protonLogo !== null) {
  let widgetLogo = stack1.addImage(protonLogo)
  widgetLogo.imageSize = new Size(30, 35)
}

stack1.addSpacer()

// ----- WIDGET-SERVER-TITLE ----- //
let serverTitle = stack1.addText(serverName)
serverTitle.font = Font.blackRoundedSystemFont(20)
serverTitle.minimumScaleFactor = 0.3
serverTitle.lineLimit = 1
serverTitle.centerAlignText()
serverTitle.textColor = new Color(textColor)

stack1.addSpacer()

// ----- WIDGET-LOAD ----- //
const canvSize = 120; //canvas size
const canvTextSize = 35; //text size
const canvRadius = 50; //circle radius
const canvWidth = 18; //circle thickness
const loadCircleRemainColor = new Color(loadColor); //remaining color
const loadCircleDepletedColor = new Color('#00000080'); //depleted color
const loadLevel = serverLoad;

const canvas = new DrawContext();
canvas.opaque = false;
canvas.size = new Size(canvSize, canvSize);

drawArc(
  Math.floor(loadLevel * 3.6),
  loadCircleRemainColor,
  loadCircleDepletedColor,
  loadLevel,
  new Color(textColor)
)
let circleImage = stack1.addImage(canvas.getImage())
circleImage.imageSize = new Size(42, 42)

// ----- WIDGET-DRAW-CIRCLE ----- //
function sinDeg(deg) {
  return Math.sin((deg * Math.PI) / 180);
}

function cosDeg(deg) {
  return Math.cos((deg * Math.PI) / 180);
}

function drawArc(deg, fillColor, strokeColor, text, txtColor) {
  let ctr = new Point(canvSize / 2, canvSize / 2),
  bgx = ctr.x - canvRadius;
  bgy = ctr.y - canvRadius;
  bgd = 2 * canvRadius;
  bgr = new Rect(bgx, bgy, bgd, bgd);

  canvas.setFillColor(fillColor);
  canvas.setStrokeColor(strokeColor);
  canvas.setLineWidth(canvWidth);
  canvas.strokeEllipse(bgr);

  for (t = 0; t < deg; t++) {
    rect_x = ctr.x + canvRadius * sinDeg(t) - canvWidth / 2;
    rect_y = ctr.y - canvRadius * cosDeg(t) - canvWidth / 2;
    rect_r = new Rect(rect_x, rect_y, canvWidth, canvWidth);
    canvas.fillEllipse(rect_r);
  }
  // attempt to draw info text
  const canvTextRect = new Rect(
    0,
    55 - canvTextSize / 2,
    canvSize,
    canvTextSize
  );

  canvas.setTextAlignedCenter();
  canvas.setTextColor(txtColor);
  canvas.setFont(Font.boldRoundedSystemFont(canvTextSize));
  if (loadLevel != 0)
    canvas.drawTextInRect(text + '%', canvTextRect);
}

widget.addSpacer()

// ----- WIDGET-SERVER-LOCATION ----- //
let serverLocTitleText = serverCity + ', ' + serverCountryFull

if (serverCity == 'N/A')
  serverLocTitleText = serverCountryFull 

let serverLocTitle = widget.addText(serverLocTitleText) 
serverLocTitle.font = Font.blackRoundedSystemFont(12)
serverLocTitle.minimumScaleFactor = 0.5;
serverLocTitle.lineLimit = 1
serverLocTitle.centerAlignText()
serverLocTitle.textColor = new Color(textColor)

// ----- WIDGET-IP ----- //
let serverIPTitle = widget.addText('🌐 ' + clientIP)

!serverConnected && hideIP ? serverIPTitle.font = Font.italicSystemFont(10) : serverIPTitle.font = Font.boldRoundedSystemFont(10);
serverIPTitle.minimumScaleFactor = 0.5;
serverIPTitle.lineLimit = 1
serverIPTitle.centerAlignText()
serverIPTitle.textColor = new Color(textColor)

widget.addSpacer()

// ----- WIDGET-FLAG ----- //
stack2 = widget.addStack()
stack2.setPadding(0, 8, 0, 8)
stack2.centerAlignContent()

if (flag !== null) {
  let widgetFlag = stack2.addImage(flag)
  widgetFlag.imageSize = new Size(50, 35)
}
stack2.addSpacer()


// ----- WIDGET-STATUS-SHIELD ----- //
let symShield = SFSymbol.named('xmark.shield')

if (serverLoad >= 90)
  symShield= SFSymbol.named('exclamationmark.shield')
else if (serverConnected)
  symShield = SFSymbol.named('lock.shield')

symShield.applyBoldWeight()
  
const canvasShield = new DrawContext();
canvasShield.size = new Size(100, 100)
canvasShield.opaque = false
canvasShield.drawImageInRect(symShield.image, new Rect(0, 0, 100, 100))

let shieldImage = stack2.addImage(canvasShield.getImage())
shieldImage.tintColor = new Color(loadColor)

if (flag == null)
  stack2.addSpacer()
widget.addSpacer()

// ----- WIDGET-UPDATED-AT ----- //
const timeFormatter = new DateFormatter()
timeFormatter.dateFormat = 'dd.MM.yyyy HH:mm:ss'

let updatedAt = widget.addText('t: ' + timeFormatter.string(new Date()))
updatedAt.font = Font.systemFont(10)
updatedAt.centerAlignText()
updatedAt.textColor = Color.white()
updatedAt.shadowRadius = 1;
updatedAt.shadowColor = Color.black();
updatedAt.shadowOffset = new Point(1, 1);



if (!config.runsInWidget) {
  await widget.presentSmall()
} else {
  // Tell the system to show the widget.
  Script.setWidget(widget)
  Script.complete()
}
