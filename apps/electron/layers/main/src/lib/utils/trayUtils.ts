import { BrowserWindow, Tray, screen } from 'electron';

const calculateTrayWindowPosition = (tray: Tray, mainWindow: BrowserWindow) => {
  const padding = 8;

  let trayBounds: Electron.Rectangle;
  if (tray) trayBounds = tray.getBounds();

  // Retrieve information about the primary display and its work area.
  const primaryDisplay = screen.getPrimaryDisplay();
  const totalScreenSize = primaryDisplay.size;
  const { workArea } = primaryDisplay;

  const mainWindowSize = mainWindow.getBounds();

  // Calculate the height of the taskbar by subtracting the work area's height from the total screen's height.
  const calculateTaskbarHeight = () => totalScreenSize.height - workArea.height;

  const calculateYPosition = () => {
    const taskbarHeight = calculateTaskbarHeight();
    if (process.platform === 'darwin') {
      // For macOS, position the window under the menu bar.
      return workArea.y + padding;
    }
    if (workArea.y === 0) {
      // The taskbar is at the bottom of the screen.
      // Subtract the window's height, the taskbar's height and the padding from the total screen's height.
      return (
        totalScreenSize.height - mainWindowSize.height - taskbarHeight - padding
      );
    }
    // The taskbar is at the top of the screen.
    // Subtract the window's height, the taskbar's height and the padding from the work area's y coordinate.
    return workArea.y - mainWindowSize.height - taskbarHeight - padding;
  };

  const calculateXPosition = () => {
    // Get the x-coordinate of the center of the tray icon.
    const trayCenterXPosition = trayBounds.x + trayBounds.width / 2;

    // Calculate the desired x-coordinate of the window such that it's centered around the tray icon.
    // We achieve this by subtracting half the window's width from the tray icon's center x-coordinate.
    const mainWindowCenterXPosition =
      trayCenterXPosition - mainWindowSize.width / 2;

    // Check for overflow on the left side of the screen.
    // If the window's x-coordinate is less than the work area's x-coordinate, adjust it to be inside the work area with a padding.
    if (mainWindowCenterXPosition < workArea.x) {
      return workArea.x + padding;
    }

    // Check for overflow on the right side of the screen.
    // If the window's right edge (x-coordinate + width) exceeds the work area's width, adjust the x-coordinate so the window's right edge is inside the work area with a padding.
    if (
      mainWindowCenterXPosition + mainWindowSize.width >
      workArea.x + totalScreenSize.width
    ) {
      return (
        workArea.x + totalScreenSize.width - mainWindowSize.width - padding
      );
    }

    // If there's no overflow, the window's x-coordinate is the calculated one.
    return mainWindowCenterXPosition;
  };

  // Round the calculated x and y coordinates of the window to prevent subpixel rendering issues.
  // Subpixel rendering issues can cause blurry visuals due to the window being positioned between pixels.
  const roundedXPosition = Math.round(calculateXPosition());
  const roundedYPosition = Math.round(calculateYPosition());

  return { roundedXPosition, roundedYPosition };
};

export default calculateTrayWindowPosition;
