(window).global = window;
window.Buffer = window.Buffer || require('buffer').Buffer;
window.process = require('process');
window.process= {
    env: {}
};
window.util = require('util');