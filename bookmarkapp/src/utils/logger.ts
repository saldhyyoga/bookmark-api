import pino from 'pino';

const logger = pino.default(
  process.env.NODE_ENV === 'development'
    ? {
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: { colorize: true },
        },
      }
    : {
        level: 'info',
      }
);

export default logger;
