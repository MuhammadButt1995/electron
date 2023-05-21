/* eslint-disable @typescript-eslint/no-var-requires */
import { parentPort } from 'worker_threads';
import WebSocket from 'ws';

const tools = [
  'InternetConnectionTool',
  'ADConnectionTool',
  'DomainConnectionTool',
];

tools.forEach((tool) => {
  const socket = new WebSocket(`ws://127.0.0.1:8000/tools/${tool}/ws`);

  socket.on('open', () => {
    console.log(`Connected to ${tool} server`);
  });

  socket.on('close', () => {
    console.log(`Disconnected from ${tool} server`);
  });

  socket.on('error', (error) => {
    console.log(`An error occurred with ${tool}: ${error}`);
  });

  socket.on('message', (data) => {
    console.log(`Received message from ${tool}: ${data}`);
    const message = JSON.parse(data.toString());

    let connectionState;
    let sublabel = '';

    switch (tool) {
      case 'InternetConnectionTool':
        connectionState = message.is_connected ? 'connected' : 'not_connected';
        parentPort?.postMessage({
          tool,
          message: {
            connectionState,
            sublabel,
          },
        });
        break;

      case 'ADConnectionTool':
        connectionState = message.is_connected ? 'connected' : 'not_connected';
        parentPort?.postMessage({
          tool,
          message: {
            connectionState,
            sublabel,
          },
        });
        break;

      case 'DomainConnectionTool':
        if (message.status === 'not_connected') {
          connectionState = 'not_connected';
          sublabel = 'Use ZPA or VPN';
        } else if (['ZPA', 'VPN'].includes(message.status)) {
          connectionState = 'connected';
          sublabel = message.status;
        } else if (message.status === 'no_internet') {
          connectionState = 'error';
          sublabel = 'requires Internet';
        } else {
          console.error(
            `Unknown connection type for DomainConnectionTool: ${message.status}`
          );
          return;
        }
        parentPort?.postMessage({
          tool,
          message: {
            connectionState,
            sublabel,
          },
        });
        break;

      default:
        console.error(`Unknown tool: ${tool}`);
    }
  });

  parentPort?.on('message', (data: any) => {
    if (data.requestLatest === tool) {
      parentPort?.postMessage({
        tool,
        message: {
          connectionState: 'loading',
          sublabel: '',
        },
      });
    }
  });
});
