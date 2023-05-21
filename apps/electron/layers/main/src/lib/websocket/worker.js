/* eslint-disable @typescript-eslint/no-var-requires */
const { parentPort } = require('node:worker_threads');
const WebSocket = require('ws');

const tools = [
  'InternetConnectionTool',
  'AzureConnectionTool',
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
    const message = JSON.parse(data);

    let connectionState;
    let sublabel = '';

    switch (tool) {
      case 'InternetConnectionTool':
        connectionState = message.connected ? 'connected' : 'not_connected';
        parentPort?.postMessage({
          tool,
          message: {
            connectionState,
            sublabel,
          },
        });
        break;

      case 'AzureConnectionTool':
        connectionState =
          message.azure_ad_joined && message.domain_joined
            ? 'connected'
            : 'not_connected';
        parentPort?.postMessage({
          tool,
          message: {
            connectionState,
            sublabel,
          },
        });
        break;

      case 'DomainConnectionTool':
        if (message.connection_type === 'NOT_CONNECTED') {
          connectionState = 'not_connected';
          sublabel = 'Use ZPA or VPN';
        } else if (['ZPA', 'VPN'].includes(message.connection_type)) {
          connectionState = 'connected';
          sublabel = message.connection_type;
        } else if (message.connection_type === 'NO_INTERNET') {
          connectionState = 'error';
          sublabel = 'requires Internet';
        } else {
          console.error(
            `Unknown connection type for DomainConnectionTool: ${message.connection_type}`
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

  parentPort.on('message', (data) => {
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
