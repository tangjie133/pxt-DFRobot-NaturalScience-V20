
enum BME{
    //%block="temperature"
    TEMP = 1,
    //%block="humidity"
    HUM = 2,
    //%block="pressure"
    PRESSURE = 3
}

enum CT{
    //%block="CO2"
    CO2=1,
    //%block="TVOC"
    TVOC=2
}
//% weight=10 color=#e7660b icon="\uf185" block="NaturalScience"
namespace NaturalScience {
    let deta:number[]=[];
    //请求数据
    //%weight=100
    //%block="requst deta"
    export function RequstDeta():void{
        pins.i2cWriteNumber(0x10, 8, NumberFormat.Int8LE);
        let _deta= pins.i2cReadBuffer(0x10, 22)
        for(let i=0; i<26; i++){
            deta[i]=_deta[i]
        }
        basic.pause(50);
    }

    //紫外线
    //%weight=100
    //%block="get ultraviolet"
    export function Ultraviolet():string{
        return  deta[0] + '.' + deta[1];
    }
    //光线
    //%weight=99
    //%block="get Light intensity value"、
    export function Light():number{
      return (deta[2]<<8)|deta[3];
    }
    //声音
    //%weight=98
    //%block="get Sound intensity"
    export function Sound():number{
        return (deta[4]<<8)|deta[5];
    }
    //18B20
    //%weight=97
    //%block="get watertemp"
    export function Watertemp():string{
        return deta[6] + '.' + deta[7];
    }

    //BME
    //%weight=96
    //%block="get|%_status"
    export function BME(_status:BME):string{
        if(_status==1){
            if(deta[8]==1){
                return deta[9] + '.' + deta[10];
            }else{
                return '-' + deta[9] + '.' + (255-deta[10]);
            }
        }else if(_status==2){
            return deta[11] + '.' + deta[12] + '%';
        }else{
            return ((deta[13]<<16)|(deta[14]<<8)|deta[15]).toString();
        }
        return ' '
    }
    //TDS
    //%weight=95
    //%block="get TDS"
    export function TDS():number{
        return (deta[16]<<8)|deta[17]
    }
    // //%weight=94
    // //%block="get TDS K value"
    // export function GetTDSK():number{
    //     pins.i2cWriteNumber(0x10, 0x1f, NumberFormat.Int8LE);
    //     let buf=pins.i2cReadBuffer(0x10, 1)
    //     return buf[0]//pins.i2cReadNumber(0x10, NumberFormat.Int8LE);
    // }
     /**
     * Set TDS
     * @param _value  , eg: 1.1
     */
    //%weight=96
    //%block="set TDS K|%value"
    export function SetTDSK(_value:number):void{
        let position:number=_value.toString().indexOf(".");
        let __value = _value*100;
        let buffer = pins.createBuffer(3);
        buffer[0]=0x1E;
        buffer[1]=parseInt(__value.toString().substr(0, position));
        buffer[2]=parseInt(__value.toString().substr(position, position+1));
        pins.i2cWriteBuffer(0x10, buffer);
    }
    //CO2
    //%weight=93
    //%block="get|%_value value"
    export function TVOC(_value:CT):number{
        if(_value==1){
            return (deta[18]<<8)|deta[19];
        }else{
            return (deta[20]<<8)|deta[21];
        }
        return 0;
    }
    // //基线值
    // //%weight=92
    // //%block="get baseline value"
    // export function GetBaseline():number{
    //     return (deta[24]<<8)|deta[25];
    // }
    //设置基线值
    //%weight=91
    //%block="set baseline|%_value value"
    export function SetBaseline(_value:number):void{
        //parseInt(_value.toString(),16)
        let buffer:Buffer = pins.createBuffer(3);
        buffer[0]=0x20;
        buffer[1]=_value>>8&0xff
        buffer[2]=_value&0xff
        pins.i2cWriteBuffer(0x10, buffer);
    }

    /**
     * OLED 12864 shows the string
     * @param _row (16 pixels per line), eg: 1
     * @param _column  , eg: 1
     * @param _leng  , eg: 16
     */
    //%weight=90
    //% _value.defl="DFRobot"
    //% _row.min=1 _row.max=8
    //% _column.min=1 _column.max=16
    //% inlineInputMode=inline
    //%block="set OLED row|%_row column|%_column leng|%leng display|%_value"
    export function OLEDString(_row:number, _column:number,_leng:number, _value:string):void{
        if(_value.length<17){
            let buffer:Buffer
            buffer = pins.createBuffer(_value.length+3)
            buffer[0]=0x28
            buffer[1]=_row;
            buffer[2]=_column;
            for (let i = 0;i < _value.length; i++){
                buffer[i+3]=_value.charCodeAt(i);
            }
            pins.i2cWriteBuffer(0x10, buffer);
        }
        else{
            let buffer:Buffer
            buffer = pins.createBuffer(19)
            buffer[0]=0x28
            buffer[1]=_row;
            buffer[2]=_column;
            for (let i = 0;i < 16; i++){
                buffer[i+3]=_value.charCodeAt(i);
            }
            pins.i2cWriteBuffer(0x10, buffer);
        }
        if(_value.length+_column<=_leng){
            ClearOLED(_row, _value.length+_column , _leng+_column);}
        else{
             ClearOLED(_row, _leng , _leng);
        }
        basic.pause(50);
    }



    
    /**
     * Clear display
     * @param _valuerow (16 pixels per line), eg: 1
     * @param _valuecolumnstart  , eg: 1
     * @param _valuecolumnstop  , eg: 1
     */
    //%weight=89
    //% _valuerow.min=1 _valuerow.max=8
    //% _valuecolumnstart.min=1 _valuecolumnstart.max=16
    //% _valuecolumnstop.min=1 _valuecolumnstop.max=16
    //%block="clear OLED row|%_valuerow startrow|%_valuecolumnstart stoprow|%_valuecolumnstop "
    export function ClearOLED(_valuerow:number, _valuecolumnstart:number, _valuecolumnstop:number):void{
        let datalength:number = _valuecolumnstop - _valuecolumnstart
        if (datalength < 0)
            return;  
        let buffer:Buffer = pins.createBuffer(datalength+3);
        buffer[0]=0x28
        buffer[1]=_valuerow;
        buffer[2]=_valuecolumnstart;
         for(let i=0; i < datalength; i++){
             buffer[i+3]=32;
         }
        pins.i2cWriteBuffer(0x10, buffer);
        basic.pause(50);
    }
    /**
     * Clear display
     * @param _valuerow (16 pixels per line), eg: 1
     */
    //%weight=88
    //% _valuerow.min=1 _valuerow.max=8
    //%block="clear OLED row|%_valuerow"
    export function ClearOLEDRow(_valuerow:number):void{
        let buffer:Buffer = pins.createBuffer(19);
        buffer[0]=0x28
        buffer[1]=_valuerow;
        buffer[2]=1;
        for(let i=0; i < 16; i++){
             buffer[i+3]=32;
         }
        pins.i2cWriteBuffer(0x10, buffer);
    }


const OBLOQ_MQTT_EASY_IOT_SERVER_CHINA = "iot.dfrobot.com.cn"
const OBLOQ_MQTT_EASY_IOT_SERVER_EN = "iot.dfrobot.com"
const microIoT_WEBHOOKS_URL = "maker.ifttt.com"
const OBLOQ_MQTT_EASY_IOT_SERVER_TK = "api.thingspeak.com"

    let IIC_ADDRESS = 0x16
    let Topic0CallBack: Action = null;
    let Topic1CallBack: Action = null;
    let Topic2CallBack: Action = null;
    let Topic3CallBack: Action = null;
    let Topic4CallBack: Action = null;
    let Wifi_Status = 0x00

    let microIoT_WEBHOOKS_KEY = ""
    let microIoT_WEBHOOKS_EVENT = ""

    let READ_STATUS = 0x00
    let SET_PARA = 0x01
    let RUN_COMMAND = 0x02

    /*set para*/
    let SETWIFI_NAME = 0x01
    let SETWIFI_PASSWORLD = 0x02
    let SETMQTT_SERVER = 0x03
    let SETMQTT_PORT = 0x04
    let SETMQTT_ID = 0x05
    let SETMQTT_PASSWORLD = 0x06
    let SETHTTP_IP = 0x07

    /*run command*/
    let CONNECT_WIFI = 0x02
    let CONNECT_MQTT = 0x05
    let SUB_TOPIC0 = 0x06
    let SUB_TOPIC1 = 0x07
    let SUB_TOPIC2 = 0x08
    let SUB_TOPIC3 = 0x09
    let SUB_TOPIC4 = 0x0A
    let PUB_TOPIC0 = 0x0B
    let PUB_TOPIC1 = 0x0C
    let PUB_TOPIC2 = 0x0D
    let PUB_TOPIC3 = 0x0E
    let PUB_TOPIC4 = 0x0F
    let GET_URL = 0x10
    let POST_URL = 0x11


    /*read para value*/
    let READ_PING = 0x01
    let READ_WIFISTATUS = 0x02
    let READ_IP = 0x03
    let READ_MQTTSTATUS = 0x04
    let READ_SUBSTATUS = 0x05
    let READ_TOPICDATA = 0x06
    let HTTP_REQUEST = 0x10
    let READ_VERSION = 0x12

    /*para status */
    let PING_OK = 0x01
    let WIFI_DISCONNECT = 0x00
    let WIFI_CONNECTING = 0x02
    let WIFI_CONNECTED = 0x03
    let MQTT_CONNECTED = 0x01
    let MQTT_CONNECTERR = 0x02
    let SUB_TOPIC_OK = 0x01
    let SUB_TOPIC_Ceiling = 0x02
   

    let microIoTStatus = ""
    let WIFI_NAME = ""
    let WIFI_PASSWORLD = ""
    let MQTT_SERVER = ""
    let MQTT_PORT = ""
    let MQTT_ID = ""
    let MQTT_PASSWORLD = ""
    let Topic_0 = ""
    let Topic_1 = ""
    let Topic_2 = ""
    let Topic_3 = ""
    let Topic_4 = ""
    let RECDATA = ""
    let HTTP_IP = ""
    let HTTP_PORT = ""
    let microIoT_IP = "0.0.0.0"
    let G_city = 0;

    export enum SERVERS {
        //% blockId=SERVERS_China block="EasyIOT_CN"
        China,
        //% blockId=SERVERS_English block="EasyIOT_EN"
        English,
        //% block="SIOT"
        SIOT
    }

    export enum TOPIC {
        topic_0 = 0,
        topic_1 = 1,
        topic_2 = 2,
        topic_3 = 3,
        topic_4 = 4
    }

    export class PacketMqtt {
        public message: string;
    }

    function microIoT_setPara(cmd: number, para: string): void {
        let buf = pins.createBuffer(para.length + 4);
        buf[0] = 0x1E
        buf[1] = SET_PARA
        buf[2] = cmd
        buf[3] = para.length
        for (let i = 0; i < para.length; i++)
            buf[i + 4] = para[i].charCodeAt(0)
        pins.i2cWriteBuffer(IIC_ADDRESS, buf);
    }

    function microIoT_runCommand(cmd: number): void {
        let buf = pins.createBuffer(3);
        buf[0] = 0x1E
        buf[1] = RUN_COMMAND
        buf[2] = cmd
        pins.i2cWriteBuffer(IIC_ADDRESS, buf);
    }

    function microIoT_readStatus(para: number): number {
        let buf = pins.createBuffer(3);
        buf[0] = 0x1E
        buf[1] = READ_STATUS
        buf[2] = para
        pins.i2cWriteBuffer(IIC_ADDRESS, buf);
        let recbuf = pins.createBuffer(2)
        recbuf = pins.i2cReadBuffer(IIC_ADDRESS, 2, false)
        return recbuf[1]
    }

    function microIoT_readValue(para: number): string {
        let buf = pins.createBuffer(3);
        let paraValue = 0x00
        let tempLen = 0x00
        let dataValue = ""
        buf[0] = 0x1E
        buf[1] = READ_STATUS
        buf[2] = para
        pins.i2cWriteBuffer(IIC_ADDRESS, buf);
        microIoT_CheckStatus("READ_IP");
        return RECDATA
    }

    function microIoT_ParaRunCommand(cmd: number, data: string): void {
        let buf = pins.createBuffer(data.length + 4)
        buf[0] = 0x1E
        buf[1] = RUN_COMMAND
        buf[2] = cmd
        buf[3] = data.length
        for (let i = 0; i < data.length; i++)
            buf[i + 4] = data[i].charCodeAt(0)
        pins.i2cWriteBuffer(IIC_ADDRESS, buf);

    }
    function microIoT_CheckStatus(cmd: string): void {
        while (true) {
            if (microIoTStatus == cmd) {
                serial.writeString("OKOK\r\n");
                return;
            }
            basic.pause(50);
        }
    }

    /**
    * WiFi configuration
    * @param SSID to SSID ,eg: "yourSSID"
    * @param PASSWORD to PASSWORD ,eg: "yourPASSWORD"
    */

    //% weight=87
    //% blockId=microIoT_WIFI block="Micro:IoT setup |Wi-Fi: |name: %SSID| password：%PASSWORD"
    export function microIoT_WIFI(SSID: string, PASSWORD: string): void {
        microIoT_setPara(SETWIFI_NAME, SSID)
        microIoT_setPara(SETWIFI_PASSWORLD, PASSWORD)
        microIoT_runCommand(CONNECT_WIFI)
        microIoT_CheckStatus("WiFiConnected");
        Wifi_Status = WIFI_CONNECTED
    }

    /**
     * MQTT configuration
     * @param SSID to SSID ,eg: "yourSSID"
     * @param PASSWORD to PASSWORD ,eg: "yourPASSWORD"
     * @param IOT_ID to IOT_ID ,eg: "yourIotId"
     * @param IOT_PWD to IOT_PWD ,eg: "yourIotPwd"
     * @param IOT_TOPIC to IOT_TOPIC ,eg: "yourIotTopic"
     * @param IP to IP ,eg: "192.168."
    */

    //% weight=86
    //% blockExternalInputs=1
    //% blockId=microIoT_MQTT block="Micro:IoT setup mqtt|IOT_ID(user): %IOT_ID| IOT_PWD(password) :%IOT_PWD|(default topic_0) Topic: %IOT_TOPIC|IP(SIOT):%IP server:%SERVERS"
    export function microIoT_MQTT(/*SSID: string, PASSWORD: string,*/
        IOT_ID: string, IOT_PWD: string,
        IOT_TOPIC: string,IP: string, servers: SERVERS):
        void {
        if (servers == SERVERS.China) {
            microIoT_setPara(SETMQTT_SERVER, OBLOQ_MQTT_EASY_IOT_SERVER_CHINA)
        } else if (servers == SERVERS.English) {
            microIoT_setPara(SETMQTT_SERVER, OBLOQ_MQTT_EASY_IOT_SERVER_EN)
        } 
        else{microIoT_setPara(SETMQTT_SERVER, IP)}
        microIoT_setPara(SETMQTT_PORT, "1883")//1883
        microIoT_setPara(SETMQTT_ID, IOT_ID)
        microIoT_setPara(SETMQTT_PASSWORLD, IOT_PWD)
        serial.writeString("wifi conneced ok\r\n");
        microIoT_runCommand(CONNECT_MQTT);
        microIoT_CheckStatus("MQTTConnected");
        serial.writeString("mqtt connected\r\n");
      
        Topic_0 = IOT_TOPIC
        microIoT_ParaRunCommand(SUB_TOPIC0, IOT_TOPIC);
        microIoT_CheckStatus("SubTopicOK");
        serial.writeString("sub topic ok\r\n");

    }

    /**
     * Add an MQTT subscription
     */

    //% weight=85
    //% blockId=microIoT_add_topic
    //% block="subscribe additional %top |: %IOT_TOPIC"
    //% top.fieldEditor="gridpicker" top.fieldOptions.columns=2
    //% advanced=true
    export function microIoT_add_topic(top: TOPIC, IOT_TOPIC: string): void {
        microIoT_ParaRunCommand((top + 0x06), IOT_TOPIC);
        microIoT_CheckStatus("SubTopicOK");

    }

    /**
     * MQTT sends information to the corresponding subscription
     * @param Mess to Mess ,eg: "mess"
     */

    //% weight=84
    //% blockId=microIoT_SendMessage block="MQTT Send Message %string| to |%TOPIC"
    export function microIoT_SendMessage(Mess: string, Topic: TOPIC): void {
        let topic = 0

        switch (Topic) {
            case TOPIC.topic_0:
                topic = PUB_TOPIC0
                break;
            case TOPIC.topic_1:
                topic = PUB_TOPIC1
                break;
            case TOPIC.topic_2:
                topic = PUB_TOPIC2
                break;
            case TOPIC.topic_3:
                topic = PUB_TOPIC3
                break;
            case TOPIC.topic_4:
                topic = PUB_TOPIC4
                break;
            default:
                break;

        }
        microIoT_ParaRunCommand(topic, Mess)

    }

    function microIoT_callback(top: TOPIC, a: Action): void {
        switch (top) {
            case TOPIC.topic_0:
                Topic0CallBack = a;
                break;
            case TOPIC.topic_1:
                Topic1CallBack = a;
                break;
            case TOPIC.topic_2:
                Topic2CallBack = a;
                break;
            case TOPIC.topic_3:
                Topic3CallBack = a;
                break;
            case TOPIC.topic_4:
                Topic4CallBack = a;
                break;
            default:
                break;
        }
    }
    /**
     * MQTT processes the subscription when receiving message
     */
    //% weight=83
    //% blockGap=60
    //% blockId=obloq_mqtt_callback_user_more block="MQTT on %top |received"
    //% top.fieldEditor="gridpicker" top.fieldOptions.columns=2
    export function microIoT_MQTT_Event(top: TOPIC, cb: (message: string) => void) {
        microIoT_callback(top, () => {
            const packet = new PacketMqtt()
            packet.message = RECDATA
            cb(packet.message)
        });
    }


    /**
    * IFTTT configuration
    * @param EVENT to EVENT ,eg: "yourEvent"
    * @param KEY to KEY ,eg: "yourKey"
    */
    //% weight=82
    //% receive.fieldEditor="gridpicker" receive.fieldOptions.columns=3
    //% send.fieldEditor="gridpicker" send.fieldOptions.columns=3
    //% blockId=microIoT_http_IFTTT
    //% block="Webhooks config:|event: %EVENT|key: %KEY|"
    export function microIoT_http_IFTTT(EVENT: string, KEY: string): void {
        microIoT_WEBHOOKS_EVENT = EVENT
        microIoT_WEBHOOKS_KEY = KEY
    }


    function microIoT_http_wait_request(time: number): string {
        if (time < 100) {
            time = 100
        }
        let timwout = time / 100
        let _timeout = 0
        while (true) {
            basic.pause(100)
            if (microIoTStatus == "HTTP_REQUEST") {
                microIoTStatus = "";
                return RECDATA
            } else if (microIoTStatus == "HTTP_REQUESTFailed") {
                microIoTStatus = "";
                return "requestFailed"
            }
            _timeout += 1
            if (_timeout > timwout) {
                return "timeOut"
            }
        }
    }

    /**
    * ThingSpeak configured and sent data
    * @param KEY to KEY ,eg: "your write api key"
    * @param time set timeout, eg: 10000
    */

    //% weight=81
    //% blockId=microIoT_http_TK_GET
    //% block="ThingSpeak(Get) | key %KEY||value1 %field1| value2 %field2| value3 %field3|  value4 %field4| value5 %field5| value6 %field6| value7 %field7| timeout(ms) %time"
    //% inlineInputMode=inline
    export function microIoT_http_TK_GET(KEY: string, field1: string, field2: string, field3: string, field4: string, field5: string, field6: string, field7: string, time: number): void {
        microIoT_setPara(SETHTTP_IP, OBLOQ_MQTT_EASY_IOT_SERVER_TK)
        let tempStr = ""
        tempStr = "update?api_key=" + KEY + "&field1=" + field1 + "&field2=" + field2 + "&field3=" + field3 + "&field4=" + field4 + "&field5=" + field5 + "&field6=" + field6 + "&field7=" + field7 +"\r"
        microIoT_ParaRunCommand(GET_URL, tempStr);
    }

    /**
     * IFTTT send data
     * time(ms): private long maxWait
     * @param time set timeout, eg: 10000
    */

    //% weight=80
    //% blockId=microIoT_http_post
    //% block="IFTTT(post) | value1 %value1| value2 %value2| value3 %value3| timeout(ms) %time"
    //% inlineInputMode=inline
    export function microIoT_http_post(value1: string, value2: string, value3: string, time: number): void {
        microIoT_setPara(SETHTTP_IP, microIoT_WEBHOOKS_URL)
        let tempStr = ""
        tempStr = "trigger/" + microIoT_WEBHOOKS_EVENT + "/with/key/" + microIoT_WEBHOOKS_KEY + ",{\"value1\":\"" + value1 + "\",\"value2\":\"" + value2 + "\",\"value3\":\"" + value3 + "\" }" + "\r"
        microIoT_ParaRunCommand(POST_URL, tempStr)
    }

    function microIoT_GetData(len: number): void {
        RECDATA = ""
        let tempbuf = pins.createBuffer(1)
        tempbuf[0] = 0x22
        pins.i2cWriteBuffer(IIC_ADDRESS, tempbuf);
        let tempRecbuf = pins.createBuffer(len)
        tempRecbuf = pins.i2cReadBuffer(IIC_ADDRESS, len, false)
        for (let i = 0; i < len; i++) {
            RECDATA += String.fromCharCode(tempRecbuf[i])
        }
    }

    function microIoT_InquireStatus(): void {
        let buf = pins.createBuffer(3)
        let tempId = 0
        let tempStatus = 0
        buf[0] = 0x1E
        buf[1] = READ_STATUS
        buf[2] = 0x06
        pins.i2cWriteBuffer(IIC_ADDRESS, buf);
        let recbuf = pins.createBuffer(2)
        recbuf = pins.i2cReadBuffer(IIC_ADDRESS, 2, false)
        tempId = recbuf[0]
        tempStatus = recbuf[1]
        switch (tempId) {
            case READ_PING:
                if (tempStatus == PING_OK) {
                    microIoTStatus = "PingOK"
                } else {
                    microIoTStatus = "PingERR"
                }
                break;
            case READ_WIFISTATUS:
                if (tempStatus == WIFI_CONNECTING) {
                    microIoTStatus = "WiFiConnecting"
                } else if (tempStatus == WIFI_CONNECTED) {
                    microIoTStatus = "WiFiConnected"
                } else if (tempStatus == WIFI_DISCONNECT) {
                    microIoTStatus = "WiFiDisconnect"
                } else {
                }
                break;
            case READ_MQTTSTATUS:
                if (tempStatus == MQTT_CONNECTED) {
                    microIoTStatus = "MQTTConnected"
                } else if (tempStatus == MQTT_CONNECTERR) {
                    microIoTStatus = "MQTTConnectERR"
                }
                break;
            case READ_SUBSTATUS:
                if (tempStatus == SUB_TOPIC_OK) {
                    microIoTStatus = "SubTopicOK"
                } else if (tempStatus == SUB_TOPIC_Ceiling) {
                    microIoTStatus = "SubTopicCeiling"
                } else {
                    microIoTStatus = "SubTopicERR"
                }
                break;
            case READ_IP:
                microIoTStatus = "READ_IP"
                microIoT_GetData(tempStatus)
                microIoT_IP = RECDATA
                break;
            case SUB_TOPIC0:
                microIoTStatus = "READ_TOPICDATA"
                microIoT_GetData(tempStatus)
                if (Topic0CallBack != null) {
                    Topic0CallBack();
                }
                break;
            case SUB_TOPIC1:
                microIoTStatus = "READ_TOPICDATA"
                microIoT_GetData(tempStatus)
                if (Topic1CallBack != null) {
                    Topic1CallBack();
                }
                break;
            case SUB_TOPIC2:
                microIoTStatus = "READ_TOPICDATA"
                microIoT_GetData(tempStatus)
                if (Topic2CallBack != null) {
                    Topic2CallBack();
                }
                break;
            case SUB_TOPIC3:
                microIoTStatus = "READ_TOPICDATA"
                microIoT_GetData(tempStatus)
                if (Topic3CallBack != null) {
                    Topic3CallBack();
                }
                break;
            case SUB_TOPIC4:
                microIoTStatus = "READ_TOPICDATA"
                microIoT_GetData(tempStatus)
                if (Topic4CallBack != null) {
                    Topic4CallBack();
                }
                break;
            case HTTP_REQUEST:
                microIoTStatus = "HTTP_REQUEST"
                microIoT_GetData(tempStatus)
                break;
            case READ_VERSION:
                microIoTStatus = "READ_VERSION"
                microIoT_GetData(tempStatus)
                break;
            default:
                break;
        }
        basic.pause(200);
    }
    basic.forever(function () {
        microIoT_InquireStatus();
    })
    
}