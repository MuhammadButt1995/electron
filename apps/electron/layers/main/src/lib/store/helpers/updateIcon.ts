/* eslint-disable import/prefer-default-export */
import { ConnectionState } from '@store/store';
import { nativeImage, NativeImage } from 'electron';
import path from 'path';

export const updateIcon = (connectionState: ConnectionState): NativeImage => {
  switch (connectionState) {
    case 'connected':
      return nativeImage.createFromPath(
        path.join(__dirname, '../assets/check.png')
      );
    case 'not_connected':
      return nativeImage.createFromPath(
        path.join(__dirname, '../assets/cross.png')
      );
    case 'error':
      return nativeImage.createFromPath(
        path.join(__dirname, '../assets/warning.png')
      );
    case 'loading':
    default:
      return nativeImage.createFromPath(
        path.join(__dirname, '../assets/loading.png')
      );
  }
};
