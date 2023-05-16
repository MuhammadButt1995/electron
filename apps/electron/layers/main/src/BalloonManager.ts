import { Tray, DisplayBalloonOptions, nativeImage } from 'electron';
import path from 'path';
import { StoreState } from './store';

interface Balloon {
  id: string;
  condition: (state: StoreState) => boolean;
  options: DisplayBalloonOptions; // Update this line
}

class BalloonManager {
  private balloons: Balloon[] = [];

  private lastDisplay = 0;

  private pendingBalloons = 0;

  constructor(private tray: Tray) {}

  registerBalloon(balloon: Balloon) {
    this.balloons.push(balloon);
  }

  checkAndDisplay(state: StoreState) {
    const now = Date.now();
    const balloon = this.balloons.find((b) => b.condition(state));
    if (!balloon) return;

    if (now - this.lastDisplay < 3000) {
      // if less than 3 seconds have passed
      // eslint-disable-next-line no-plusplus
      this.pendingBalloons++;
      this.tray.displayBalloon({
        // Update this block
        icon: nativeImage.createFromPath(
          path.join(__dirname, '../assets/wifi-lost.png')
        ),
        title: 'Multiple Connection Changes',
        content: `${this.pendingBalloons} changes have happened to your connections.`,
      });
    } else {
      this.tray.displayBalloon(balloon.options);
    }

    this.lastDisplay = now;
    this.pendingBalloons = 0;
  }
}

export default BalloonManager;
