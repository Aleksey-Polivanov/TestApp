const winston = require('winston'),
      ENV = process.env.NODE_ENV;

const env = 'development';
// can be much more flexible than that O_o
const getLogger = module => {

    const path = module.filename.split('/').slice(-2).join('/'); // отобразим метку с именем файла, который выводит сообщение

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: (env === 'development') ? 'debug' : 'error',
                label: path
            })
        ]
    });
};

module.exports = getLogger;