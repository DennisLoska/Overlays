/* this class can be maybe replaced with the framework mathjs from mathjs.org */
var math = require('mathjs');

class InverseMatrix {
    constructor() {
        console.log(StaticMethodCall.debugger());
        // expected output: "static method has been called."
    }

    static debugger() {
        return 'static method from InverseMatrix has been called.';
    }

    static invert(matrix) {
        return math.inv(matrix);
    }
}