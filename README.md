# NaturalScience

[无](无)
## Basic usage

* 请求传感器数据

```blocks

    basic.forever(function () {
        naturalScience.requstdata()
    })

```

* 控制电机的方向、速度和停止

```blocks

    basic.forever(function () {
        naturalScience.mototRun(DIR.CW, 100)
        basic.pause(1000)
        naturalScience.mototStop()
        basic.pause(1000)
    })

```
* 控制RGB灯显示不同颜色

```blocks

    naturalScience.microIoT_setBrightness(100)
    basic.forever(function () {
        naturalScience.microIoT_setIndexColor(naturalScience.microIoT_ledRange(0, 3), 0xffff00)
        basic.pause(1000)
        naturalScience.ledRainbow(1, 360)
        basic.pause(1000)
        naturalScience.microIoT_ledBlank()
        basic.pause(1000)
    })

```
* OLED显示模块可以用于显示传感器数据，数字和字符串都能够在屏幕上面显示

```blocks

    basic.forever(function () {
        naturalScience.setOLEDShowString(1, 16, 1, "Hi DFRobot")
        naturalScience.setOLEDShowNumber(1, 16, 1, 2020)
    })

```

* 清除OLED显示屏上的数字或字符串，能够清除指定位置的字符串和数字也能清除整行数据

```blocks

    basic.forever(function () {
        naturalScience.clearOLED(1, 16, 1)
        naturalScience.clearOLEDRow(1)
    })

```

* 在OLED上显示传感器数据

```blocks

    basic.forever(function () {
        naturalScience.requstdata()
        naturalScience.setOLEDShowString(1, 7, 1, "UV:" + naturalScience.getUltraviolet())
        naturalScience.setOLEDShowString(8, 16, 1, "-SOD:" + naturalScience.getSound())
        naturalScience.setOLEDShowString(1, 7, 2, "TC:" + convertToText(naturalScience.getTVOC(CT.TVOC)))
        naturalScience.setOLEDShowString(8, 16, 2, "-CO2:" + convertToText(naturalScience.getTVOC(CT.CO2)))
        naturalScience.setOLEDShowString(1, 7, 3, "TE:" + naturalScience.getBME(BME.TEMP))
        naturalScience.setOLEDShowString(8, 16, 3, "-WTE:" + naturalScience.getWatertemp())
        naturalScience.setOLEDShowString(1, 7, 4, "LI:" + convertToText(naturalScience.getLight()))
        naturalScience.setOLEDShowString(8, 16, 4, "-TDS:" + convertToText(naturalScience.getTDS()))
        naturalScience.setOLEDShowString(1, 16, 5, "HU:" + naturalScience.getBME(BME.HUM))
        naturalScience.setOLEDShowString(1, 16, 6, "PE:" + naturalScience.getBME(BME.PRESSURE))
    })

```

* IOT控制模块，通过配置能够访问IFTTT、Thingspeak、SIOT、EasyIOT物联网平台

```blocks

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

```
## License

MIT

Copyright (c) 2020, microbit/micropython Chinese community  

## Supported targets

* for PXT/microbit