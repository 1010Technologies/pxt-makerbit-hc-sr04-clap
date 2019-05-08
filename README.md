# MakerBit Ultrasonic

[![Build Status](https://api.travis-ci.org/1010Technologies/pxt-makerbit-hc-sr04-clap.svg?branch=master)](https://travis-ci.org/1010Technologies/pxt-makerbit-hc-sr04-clap)

MakeCode extension for detecting claps and finger snaps with a modified HC-SR04 ultrasonic sensor.

## MakerBit Board

The MakerBit connects to the BBC micro:bit to provide easy connections to a wide variety of sensors, actuators and other components.

http://makerbit.com/

| ![MakerBit](https://github.com/1010Technologies/pxt-makerbit/raw/master/MakerBit.png "MakerBit") | ![MakerBit+R](https://github.com/1010Technologies/pxt-makerbit/raw/master/MakerBit+R.png "MakerBit+R") |
| :----------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: |
|                                            _MakerBit_                                            |                                   _MakerBit+R with motor controller_                                   |

## Clap Detector

An HC-SR04 ultrasonic distance sensor can notify clap and finger snap sounds. Among audible frequencies, claps and snaps contain ultrasonic portions and thus the 40kHz receiver of the HC-SR04 is able to detect them. This requires a slight hardware modification of the sensor itself. We need to make sure no other ultrasonic sounds are transmitted and therefore have to cover the transmitter (left cylinder). It turned out that chewing gum works well.

![HC-SR04](https://github.com/1010Technologies/pxt-makerbit-hc-sr04-clap/raw/master/icon.png "HC-SR04 clap detector with chewing gum")

### MakerBit onClap

Perform an action when a clap or finger snap is detected.

```sig
makerbit.onClap(DigitalPin.P5, DigitalPin.P8, () => {});
```

### Ultrasonic Clap & Snap Example

```blocks
makerbit.onClap(DigitalPin.P5, DigitalPin.P8, function () {
    basic.showLeds(`
        # # # # #
        # . . . #
        # . . . #
        # . . . #
        # # # # #
        `)
    basic.showLeds(`
        . . . . .
        . # # # .
        . # . # .
        . # # # .
        . . . . .
        `)
})
```

## License

Licensed under the MIT License (MIT). See LICENSE file for more details.

## Supported targets

- for PXT/microbit
- for PXT/calliope
