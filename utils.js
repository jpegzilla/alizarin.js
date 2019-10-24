module.exports = {
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
