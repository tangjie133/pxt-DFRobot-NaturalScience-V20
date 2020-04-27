
enum BME{
    //%block="temp"
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
    let OLEDdeta:number[]=[0x28];
    //请求数据
    //%weight=100
    //%block="requst deta"
    export function RequstDeta():void{
        pins.i2cWriteNumber(0x10, 8, NumberFormat.Int8LE);
        let _deta= pins.i2cReadBuffer(0x10, 26)
        for(let i=0; i<26; i++){
            deta[i]=_deta[i]
        }
    }

    //紫外线
    //%weight=100
    //%block="get uvIntensity"
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
                return '-' + deta[9] + '.' + deta[10];
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
    //%weight=94
    //%block="get TDS K value"
    export function GetTDSK():string{
        return deta[22] + '.' + deta[23];
    }
    //%weight=96
    //%block="set TDS K|%value"
    export function SetTDSK(_value:number):void{
        let position:number=_value.toString().indexOf(".");
        let __valud = _value*100;
        let buffer:Buffer = pins.createBuffer(4);
        buffer[0]=0x1E;
        buffer[1]=parseInt(__valud.toString().substr(0, position));
        buffer[2]=0x1F;
        buffer[3]=parseInt(__valud.toString().substr(position, position+1));
        pins.i2cWriteBuffer(0x10, buffer);
        serial.writeNumber(parseInt(__valud.toString().substr(position, position+1)));
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
    //基线值
    //%weight=92
    //%block="get baseline value"
    export function GetBaseline():string{
        return deta[24] + '.' + deta[25];
    }
    //设置基线值
    //%weight=91
    //block="set baseline|%_value value"
    export function SetBaseline(_value:number):void{
        let position:number=_value.toString().indexOf(".");
        let __valud = _value*100;
        let buffer:Buffer = pins.createBuffer(4);
        buffer[0]=0x1E;
        buffer[1]=parseInt(__valud.toString().substr(0, position));
        buffer[2]=0x1F;
        buffer[3]=parseInt(__valud.toString().substr(position, position+1));
        pins.i2cWriteBuffer(0x10, buffer);
    }

    //OLED
    /**
     * OLED 12864 shows the string
     * @param _row (16 pixels per line), eg: 1
     * @param _column  , eg: 1
     */
    //%weight=90
    //% _value.defl="DFRobot"
    //% _row.min=1 _row.max=8
    //% _column.min=1 _column.max=16
    //%block="set OLED row|%_row column|%_column display|%_value"
    export function OLEDString(_row:number, _column:number, _value:string):void{
        let buffer:Buffer
        if((17-_column)>=_value.length){
            buffer = pins.createBuffer( _value.length+3)
            buffer[0]=0x28
            buffer[1]=_row;
            buffer[2]=_column;
            for (let i = 0;i < _value.length; i++){
                buffer[i+3]=_value.charCodeAt(i);
            }
        }else{
            buffer = pins.createBuffer(19)
            buffer[0]=0x28
            buffer[1]=_row;
            buffer[2]=_column;
            for (let i = 0; i < 16; i++){
                buffer[i+3]=_value.charCodeAt(i);
            }
        }
        pins.i2cWriteBuffer(0x10, buffer);
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
        let datalength:number = _valuecolumnstop - _valuecolumnstart + 1 
        let buffer:Buffer = pins.createBuffer(datalength+3);
        buffer[0]=0x28
        buffer[1]=_valuerow;
        buffer[2]=_valuecolumnstart;
         for(let i=0; i < datalength; i++){
             buffer[i+3]=32;
         }
        pins.i2cWriteBuffer(0x10, buffer);
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
    
}