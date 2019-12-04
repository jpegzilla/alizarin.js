"use strict";

const ALIZARINDEVELOPMENTMODE = true;
const ALIZARINVERSION = "1.0.0";
let APPNAME = null;

// determine whether this is node or the browser
const ENVIRONMENT =
  typeof process === "object" && typeof window === "undefined"
    ? "node"
    : "browser";

if (ALIZARINDEVELOPMENTMODE && ENVIRONMENT == "browser") {
  const style = [
    "color: rgb(48, 98, 223); font-style: italic",
    "color: rgb(255,255,255); font-style: italic"
  ];
  console.log(
    "%cusing %calizarin.js %cversion %c" + ALIZARINVERSION,
    style[1],
    style[0],
    style[1],
    style[0]
  );
}

// utilities used by classes

const utils = {
  ansi: {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    italic: "\x1b[3m",
    underline: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    strike: "\x1b[9m",

    fgBlack: "\x1b[30m",
    fgRed: "\x1b[31m",
    fgGreen: "\x1b[32m",
    fgYellow: "\x1b[33m",
    fgBlue: "\x1b[34m",
    fgMagenta: "\x1b[35m",
    fgCyan: "\x1b[36m",
    fgWhite: "\x1b[37m",

    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m"
  },

  isFunction: function(fn) {
    return fn && {}.toString.call(fn) === "[object Function]";
  },

  readLevels: function(allLevels, level) {
    console.log(allLevels);
    let checkForLevel = allLevels;

    return checkForLevel.indexOf(level) > -1
      ? true
      : checkForLevel.indexOf("all") > -1
        ? true
        : false;
  },

  colors: {
    log: "rgb(213, 237, 237)",
    info: "rgb(48, 98, 223)",
    warn: "rgb(223, 118, 31)",
    error: "rgb(191, 34, 76)",
    success: "rgb(64, 215, 65)",
    failure: "rgb(255, 63, 57)"
  },

  symbols: {
    check: "✔",
    rdarr: "⇒",
    ldarr: "⇐",
    log: "✎",
    info: "𝕚",
    warn: "⚠",
    error: "⨯",
    success: "👍",
    failure: "👎",
    note: "🗏"
  },

  getScriptName: function() {
    let error = new Error(),
      source,
      lastStackFrameRegex = new RegExp(/.+\/(.*?):\d+(:\d+)*$/),
      currentStackFrameRegex = new RegExp(/getScriptName \(.+\/(.*):\d+:\d+\)/);

    if (
      (source = lastStackFrameRegex.exec(error.stack.trim())) &&
      source[1] != ""
    )
      return source[1];
    else if ((source = currentStackFrameRegex.exec(error.stack.trim())))
      return source[1];
    else if (error.fileName != undefined) return error.fileName;
  },

  date: function() {
    let d = new Date();
    let yearMonthDay = [
      d.getFullYear(),
      (d.getMonth() + 1).toString().padStart(2, "0"),
      d
        .getDate()
        .toString()
        .padStart(2, "0")
    ].join(".");

    let hoursMinutesSeconds = [
      d
        .getHours()
        .toString()
        .padStart(2, "0"),
      d
        .getMinutes()
        .toString()
        .padStart(2, "0"),
      d
        .getSeconds()
        .toString()
        .padStart(2, "0")
    ].join(":");

    let fullDateTime = `${yearMonthDay}, ${hoursMinutesSeconds}`;

    return {
      yearMonthDay: yearMonthDay,
      hoursMinutesSeconds: hoursMinutesSeconds,
      fullDateTime: fullDateTime
    };
  },

  showStackTrace: function() {
    const styles = [
      "font-size: 14px; color: rgb(206, 96, 221)",
      "font-style: italic; font-size: 14px; color: rgb(206, 96, 221)"
    ];
    console.groupCollapsed(
      "%cstack trace %c(click to expand)",
      styles[0],
      styles[1]
    );
    console.trace();
    console.groupEnd();
  }
};

utils.nodeColors = {
  log: utils.ansi.fgWhite,
  info: utils.ansi.fgBlue,
  warn: utils.ansi.fgYellow,
  error: utils.ansi.fgRed,
  success: utils.ansi.fgGreen,
  failure: utils.ansi.fgRed
};

// class for creating fancy console messages

class alizarin {
  constructor(appName = APPNAME) {
    this.levels = "all";
    this.fontsize = 14 + "px";
    this.headersize = 16 + "px";
    this.colors = utils.colors;
    this.appName = appName;
  }

  setAppName(appName) {
    if (!appName)
      throw new Error("alizarin.setAppName() must be called with an argument.");

    APPNAME = appName;
    this.appName = APPNAME;
  }

  // regular log messages
  log(msg) {
    if (!msg)
      throw new Error("alizarin.log() must be called with an argument.");

    if (this.levels.indexOf("none") > -1) return false;

    if (utils.readLevels(this.levels, "log")) {
      // log the message
    } else return false;
  }

  // info
  // error
  // warn
  // assert
  // fail
  // success

  // clear the console
  clear() {
    if (ENVIRONMENT == "browser") console.clear();
    else process.stdout.write("\x1b[0f");

    return 0;
  }

  // setlevels takes any amount of strings as arguments and
  // reduces the array to only acceptable logging levels
  setLevels(levels) {
    if (typeof levels == "string") levels = levels.split(/\b\s/gi);

    if (levels.indexOf("none") >= 0 && levels.length > 1)
      throw new Error(
        "if levels is set to none, no other logging levels can be used."
      );

    if (levels.length == 0)
      throw new Error(
        "cannot set levels with zero parameters. if you're trying to set levels to none, use 'none'."
      );

    const acceptableLevels = ["log", "warn", "info", "error", "all", "none"];

    levels = levels.filter(
      level => (acceptableLevels.indexOf(level) >= 0 ? true : false)
    );

    return (this.levels = levels);
  }

  // log information about the library
  printInfo() {
    if (this.levels.indexOf("none") > -1) return false;
    console.group(
      `${
        ENVIRONMENT == "node"
          ? utils.ansi.reset +
            utils.ansi.reverse +
            utils.ansi.bright +
            utils.ansi.fgWhite +
            "%s" +
            utils.ansi.reset
          : ""
      }`,
      " library info: "
    );
    let prefix =
      ENVIRONMENT == "browser"
        ? "%c====== alizarin 💖 logger v" + ALIZARINVERSION + " ======\r\n\r\n"
        : "\r\n====== alizarin ♥ logger v" + ALIZARINVERSION + " ======\r\n";

    let prefixStyle =
      ENVIRONMENT == "browser"
        ? `font-family: monospace; color: ${this.colors.success}; font-size: ${
            this.headersize
          }`
        : `${utils.ansi.reset}${utils.ansi.bright}${utils.ansi.fgMagenta}`;

    let msg = `${ENVIRONMENT == "browser" ? "%c" : ""}[ ${
      utils.date().fullDateTime
    } ] INFORMATION

${
      ENVIRONMENT == "browser"
        ? "GENERAL"
        : utils.ansi.reset +
          utils.ansi.reverse +
          utils.ansi.fgMagenta +
          " GENERAL " +
          utils.ansi.reset +
          utils.ansi.fgMagenta
    }

name: alizarin.js
version: ${ALIZARINVERSION}
author: jpegzilla - https://jpegzilla.com
repository: https://github.com/jpegzilla/alizarin.js

${
      ENVIRONMENT == "browser"
        ? "APPLICATION / SYSTEM"
        : utils.ansi.reset +
          utils.ansi.fgMagenta +
          utils.ansi.reverse +
          " APPLICATION / SYSTEM " +
          utils.ansi.reset +
          utils.ansi.fgMagenta
    }

application name: ${this.appName || "no name set"}
file: ${
      ENVIRONMENT == "browser"
        ? window.location.pathname + utils.getScriptName()
        : __filename.slice(__dirname.length + 1)
    }
${
      ENVIRONMENT == "browser"
        ? "agent: " + navigator.userAgent
        : "os type: " + require("os").type()
    }
${
      ENVIRONMENT == "browser"
        ? "platform: " + navigator.platform
        : "os platform: " + require("os").platform()
    }
    `;

    let msgStyle =
      ENVIRONMENT == "browser"
        ? `font-style: italic; font-family: monospace; color: #fff`
        : `${utils.ansi.reset}${utils.ansi.fgMagenta}`;

    if (ENVIRONMENT == "browser") {
      console.log(prefix, prefixStyle);
      console.log(msg, msgStyle);
    } else {
      console.log(prefixStyle, prefix);
      console.log(msgStyle, msg);
    }

    console.groupEnd();
  }
}

const logger = new alizarin("jpegzilla's testing app");

logger.printInfo();

if (ENVIRONMENT == "node") module.exports = alizarin;
