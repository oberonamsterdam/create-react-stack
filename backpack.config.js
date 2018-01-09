module.exports = {
    webpack: (config) => {
        config.entry.main = './src/' + process.env.BACKPACK_ENTRY + '.js';
        return config;
    }
}