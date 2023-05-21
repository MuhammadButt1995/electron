/* eslint-disable import/prefer-default-export */
import { nativeImage } from 'electron';

export const getCrossPlatformIcon = (iconPath: string) => {
  const isMacOS = process.platform === 'darwin';
  const extension = isMacOS ? '.icns' : '.ico';

  return nativeImage.createFromPath(`${iconPath}${extension}`);
};
