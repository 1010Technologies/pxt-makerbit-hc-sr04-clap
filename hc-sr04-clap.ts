// MakerBit blocks supporting a HC-SR04 ultrasonic distance sensor

namespace makerbit {
  const MICROBIT_MAKERBIT_ULTRASONIC_CLAP_ID = 3475;

  /**
   * Do something when a clap or finger snap is detected.
   * @param handler body code to run when event is raised
   */
  //% subcategory="Clap"
  //% blockId=makerbit_ultrasonic_on_clap
  //% block="on clap detected | with HC-SR04 Trig at %trig | and Echo at %echo"
  //% trig.fieldEditor="gridpicker"
  //% trig.fieldOptions.columns=4
  //% trig.fieldOptions.tooltips="false"
  //% echo.fieldEditor="gridpicker"
  //% echo.fieldOptions.columns=4
  //% echo.fieldOptions.tooltips="false"
  //% weight=49
  export function onClap(
    trig: DigitalPin,
    echo: DigitalPin,
    handler: () => void
  ) {
    initClapDetection(trig, echo);

    control.onEvent(
      MICROBIT_MAKERBIT_ULTRASONIC_CLAP_ID,
      EventBusValue.MICROBIT_EVT_ANY,
      () => {
        handler();
      }
    );
  }

  function initClapDetection(trig: DigitalPin, echo: DigitalPin) {
    const adjustmentTimeframe = input.runningTime() + 3000;
    let timeout = 30000;

    let nextTrigger = input.runningTime() + 2000;

    control.inBackground(() => {
      while (true) {
        if (nextTrigger != 0 && input.runningTime() > nextTrigger) {
          triggerPulse(trig);
          nextTrigger = 0;
        }
        basic.pause(20);
      }
    });

    triggerPulse(trig);

    pins.onPulsed(echo, PulseValue.High, () => {
      const pulseDuration = pins.pulseDuration();

      if (
        pulseDuration > timeout &&
        adjustmentTimeframe > input.runningTime()
      ) {
        timeout = pulseDuration;
        // makerbit.showNumberOnLcd(timeout, 0, 8);
      }

      if (pulseDuration > timeout - (timeout >> 4)) {
        const n = input.runningTime() + 30;
        if (n > nextTrigger) {
          nextTrigger = n;
        }

        // makerbit.showNumberOnLcd(pulseDuration, 25, 31);
      } else if (pulseDuration > 0) {
        control.raiseEvent(MICROBIT_MAKERBIT_ULTRASONIC_CLAP_ID, 1);
        // makerbit.showNumberOnLcd(pulseDuration, 16, 24);
        // prevent double detection of same clap/snap
        const n = input.runningTime() + 500;
        if (n > nextTrigger) {
          nextTrigger = n;
        }
      }
    });
  }

  function triggerPulse(trig: DigitalPin) {
    // Reset trigger pin
    pins.setPull(trig, PinPullMode.PullNone);
    pins.digitalWritePin(trig, 0);
    control.waitMicros(2);

    // Trigger pulse
    pins.digitalWritePin(trig, 1);
    control.waitMicros(10);
    pins.digitalWritePin(trig, 0);
  }
}
