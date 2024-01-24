/*global Superviolet*/
self.__sv$config = {
    prefix: '/superviolet/',
    bare: ['https://anura.pro/bare/', 'https://blueprints.lhost.dev/', 'https://strainer.lhost.dev/'],
    encodeUrl: Superviolet.codec.xor.encode,
    decodeUrl: Superviolet.codec.xor.decode,
    handler: '/sv/sv.handler.js',
    client: '/sv/sv.client.js',
    bundle: '/sv/sv.bundle.js',
    config: '/sv/sv.config.js',
    sw: '/sv/sv.sw.js',
    inject: function(url) {
        return "";
    },
    middleware: async function(req) {
        return req;
    }
};
