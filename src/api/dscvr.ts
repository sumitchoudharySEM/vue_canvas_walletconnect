import type { CanvasInterface } from '@dscvr-one/canvas-client-sdk';

export const validateHostMessage = async (message: CanvasInterface.BaseHostMessage) => {
  // TODO: Implement proper validation
  return !!message;
};