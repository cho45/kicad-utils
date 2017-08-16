#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minimist = require("minimist");
const commands = {
    sch2svg: function (_argv) {
        const argv = minimist(_argv, {
            boolean: true,
            alias: {
                "o": "output",
                "h": "help",
            }
        });
        console.log(argv);
    }
};
const argv = minimist(process.argv.slice(2), {
    stopEarly: true,
    boolean: true,
    alias: {
        "h": "help",
    }
});
const subcommand = argv._.shift();
if (!subcommand || argv.help) {
    console.log("Usage: kicad-utils [opts] [subcommand]");
    console.log('Options:');
    console.log('  -h --help: show help');
    console.log('Sub commands:');
    process.exit(argv.help ? 0 : 1);
}
const func = commands[subcommand];
if (!func) {
    console.warn(`Unknown subcommand ${subcommand}`);
    process.exit(1);
}
func(argv._);
//# sourceMappingURL=kicad-utils_cui.js.map