"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducers = void 0;
var Globals = require("./Globals");
var ApiInfo = require("./ApiInfo");
var DocumentProcess = require("./DocumentProcess");
// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
exports.reducers = {
    globals: Globals.reducer,
    apiInfo: ApiInfo.reducer,
    docProcess: DocumentProcess.reducer
};
//# sourceMappingURL=index.js.map