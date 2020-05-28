input.onButtonPressed(Button.A, function () {
    naturalScience.microIoT_SendMessage("78", naturalScience.TOPIC.topic_0)
})
input.onButtonPressed(Button.AB, function () {
    naturalScience.microIoT_http_post("12", "344", "44", 10000)
})
input.onButtonPressed(Button.B, function () {
    naturalScience.microIoT_http_TK_GET(
    "GX8STNEAUFMWNBDG",
    "95",
    "12",
    "8",
    "",
    "",
    "",
    "",
    10000
    )
})
naturalScience.microIoT_WIFI("hitest", "12345678")
naturalScience.microIoT_http_IFTTT("BBB", "dtpfTlU3Wqa8y0HRh77xXE")
naturalScience.microIoT_MQTT(
"rHpr0RcWR",
"9NtrAg5ZRz",
"DN5FYlDZR",
"192.168.",
naturalScience.SERVERS.China
)
naturalScience.setTDSK(1.1)
basic.forever(function () {
    naturalScience.requstdata()
    naturalScience.setOLEDShowString(1, 1, 7, "UV:" + naturalScience.getUltraviolet())
    naturalScience.setOLEDShowString(1, 8, 16, "-SOD:" + naturalScience.getSound())
    naturalScience.setOLEDShowString(2, 1, 7, "TC:" + convertToText(naturalScience.getTVOC(CT.TVOC)))
    naturalScience.setOLEDShowString(2, 8, 16, "-CO2:" + convertToText(naturalScience.getTVOC(CT.CO2)))
    naturalScience.setOLEDShowString(3, 1, 7, "TE:" + naturalScience.getBME(BME.TEMP))
    naturalScience.setOLEDShowString(3, 8, 16, "-WTE:" + naturalScience.getWatertemp())
    naturalScience.setOLEDShowString(4, 1, 7, "LI:" + convertToText(naturalScience.getLight()))
    naturalScience.setOLEDShowString(4, 8, 16, "-TDS:" + convertToText(naturalScience.getTDS()))
    naturalScience.setOLEDShowString(5, 1, 16, "HU:" + naturalScience.getBME(BME.HUM))
    naturalScience.setOLEDShowString(6, 1, 16, "PE:" + naturalScience.getBME(BME.PRESSURE))
})
