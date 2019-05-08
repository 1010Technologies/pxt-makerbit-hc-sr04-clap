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
    let nextTrigger = 0;
    let noTriggerInALongTimeTrigger = 0;

    control.inBackground(() => {
      while (true) {
        basic.pause(20);
        const now = input.runningTime();
        if (
          (nextTrigger != 0 && now > nextTrigger) ||
          now > noTriggerInALongTimeTrigger
        ) {
          triggerPulse(trig);
          nextTrigger = 0;
          noTriggerInALongTimeTrigger = now + 2000;
        }
      }
    });

    let adjustmentTimeframe = 0;
    let hcsr04Timeout = 30000;

    pins.onPulsed(echo, PulseValue.High, () => {
      const pulseDuration = pins.pulseDuration();
      const now = input.runningTime();

      // Adjust device timeout duration
      if (hcsr04Timeout === 30000) {
        // no timeout received - probably because of ultrasonic noise
        adjustmentTimeframe = now + 3000;
      }
      if (pulseDuration > hcsr04Timeout && now < adjustmentTimeframe) {
        hcsr04Timeout = pulseDuration;
        // makerbit.showNumberOnLcd(hcsr04Timeout, 0, 8);
      }

      if (pulseDuration > hcsr04Timeout - (hcsr04Timeout >> 4)) {
        const n = now + 30;
        if (n > nextTrigger) {
          nextTrigger = n;
        }

        // makerbit.showNumberOnLcd(pulseDuration, 25, 31);
      } else if (pulseDuration > 0) {
        control.raiseEvent(MICROBIT_MAKERBIT_ULTRASONIC_CLAP_ID, 1);
        // makerbit.showNumberOnLcd(pulseDuration, 16, 24);
        // prevent double detection of same clap/snap
        const n = now + 500;
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
