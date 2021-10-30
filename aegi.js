var gTextCursor = -1;
var gMessage = "";
var gTrickReserve = false;
var gBreath = 100;
var gTension = 0;
var gPrevTension = 0;
var gIntervalTimer = null;
var gNextInterval = 0;

var gAlreadyTrick = false;
var gFinish = false;
var gRequestReset = false;

var gReactionTable = {
  あ: [
    "っ",
    "っく",
    "っん",
    "ん゛っ",
    "ひっ",
    "はっ",
    "っぁ゛",
    "あっ",
    "あぁっ",
    "っぁ",
    "ぁっ",
    "ひぃっ",
    "ひっ",
    "っぁ゛",
    "ん゛っ",
    "ぁぁ゛っ",
    "あ゛っ",
  ],
  い: [
    "ん゛っ",
    "んっ",
    "ぎっ",
    "っ",
    "ひぃっ",
    "ぎっ",
    "ぎぃッ",
    "んっ",
    "ぁッ",
    "ィっ",
    "っぃん",
  ],
  う: ["ぐっ", "ふっ", "ん゛っ", "ぅっ", "っぐ", "っん"],
  え: ["ん゛っ", "っ", "ぁッ", "っ…ぇ", "ひっ", "ぇっん゛"],
  お: [
    "ん゛っ",
    "お゛っ",
    "ぉ゛ッ",
    "ぉ゛ッひ",
    "っぉ",
    "お゛っ",
    "っぉ゛",
    "おっ",
    "お゛っ",
    "おぅ゛っ",
    "ぉっ",
    "ぅ゛っ",
    "ォっ",
  ],
  ん: ["んっ", "お゛っ", "ぅ゛っ", "うっ"],
};

var checked_heart = () => {
  return document.getElementById("Heart").checked;
};
var checked_declare = () => {
  return document.getElementById("Declare").checked;
};
var checked_oh = () => {
  return document.getElementById("OhMode").checked;
};
var checked_supertrick = () => {
  return document.getElementById("SuperTrick").checked;
};

function sampleString(arr, threshold) {
  return arr.filter((c) => {
    if (Math.random() < threshold) return c;
  });
}

function insertString(pos, str) {
  if (str == "" || str == undefined || str.includes("undefined")) return;
  var message = gMessage.substring(0, pos);
  gMessage = message + str + gMessage.substring(pos);
}

function insertExclamation(str) {
  if (100 >= gTension && gTension > 50) {
    str += "！";
  } else if (100 < gTension) {
    if (!checked_heart()) {
      str += "！";
    } else if (Math.random() < 0.75) {
      str += "♥";
      if (200 < gTension) {
        var num = (gTension - 200) / 500;
        for (var heart_idx = 0; heart_idx < num; heart_idx++)
          if (Math.random() < 0.5) str += "♥";
      }
    } else {
      str += "！";
      if (200 < gTension) {
        var num = (gTension - 200) / 500;
        for (var heart_idx = 0; heart_idx < num; heart_idx++)
          if (Math.random() < 0.5) str += "！";
      }
    }
  }
  return str;
}

function start() {
  var input_area = document.getElementById("Input");
  gMessage = input_area.value;
  gFinish = false;
  gTextCursor = 0;
  if (gIntervalTimer) clearTimeout(gIntervalTimer);
  update();
}

function update() {
  if (gRequestReset) {
    gRequestReset = false;
    gBreath = 100;
    gTension = 0;
    gPrevTension = 0;
    gAlreadyTrick = false;
  }

  var output_area = document.getElementById("Output");
  if (output_area === null) update();
  output_area.scrollTop = output_area.scrollHeight;

  var interval = 80 - 15 * (gTension / 1000);
  if (gTrickReserve) {
    gAlreadyTrick = true;
    trick();
    interval += 100;
  }

  if (gAlreadyTrick) {
    var last_char = gMessage[gTextCursor];
    if (last_char === "\n") {
      // nothing
    } else if (last_char === "、") {
      gBreath += 15;
      interval += 100;
    } else if (last_char === "。") {
      gBreath += 35;
      interval += 200;
    } else if (last_char === "？") {
      gBreath += 35;
      interval += 200;
    } else if (last_char === "…") {
      gBreath += 50;
      interval += 300;
    } else {
      gBreath -= 1;
      gTension -= 0.5;
    }

    if (1000 < gTension) gTension = 1000;
    if (gTension < 0) gTension = 0;
    if (200 < gBreath) gBreath = 200;
    if (gBreath < -100) gBreath = -100;

    if (0 < gTension) {
      var str = "";
      if (gBreath < 0) {
        gBreath += 1;
        sampleString(
          checked_oh() ? ["…お…", "…っんぉッ"] : ["…う…", "…はひ…"],
          0.1
        ).forEach((c) => {
          str += c;
          interval += 50;
        });
        if (Math.random() < 0.1) (str += "…っはぁッ"), (interval += 50);
        if (Math.random() < 0.05) (str += "…はーっ…"), (interval += 50);
        if (Math.random() < 0.01) (str += "…はっ…"), (interval += 50);
        gBreath += 2.5;
      } else if (gBreath < 20) {
        gBreath += 2;
        if (Math.random() < 0.05) (str += "…っ"), (interval += 50);
      } else if (gBreath < 50) {
        gBreath += 1.5;
        if (Math.random() < 0.2) (str += "…"), (interval += 50);
      }
      if (str === "") insertString(gTextCursor, str);
    }

    if (checked_declare() && Math.random() < 0.01 && 250 < gTension) {
      var str = "";
      sampleString(["っ", "…", "ッ"], 0.25).forEach((c) => {
        str += c;
        interval += c === "…" ? 100 : 50;
      });
      str += "イきました";
      sampleString(
        checked_oh()
          ? ["お", "お゛", "ん", "ん゛", "っ", "…", "ッ"]
          : ["あ", "あ゛", "っ", "…", "ッ"],
        0.25
      ).forEach((c) => {
        str += c;
        interval += c === "…" ? 100 : 50;
      });

      insertString(gTextCursor, insertExclamation(str));

      if (Math.random() < 0.01) trick();
      if (Math.random() < 0.25) {
        var top = gTextCursor - Math.floor(Math.random() * 10);
        var str = gMessage.substring(top < 0 ? 0 : top, gTextCursor);

        var proceed = 0;
        sampleString(["…っ", "……", "…ッ"], 0.25).forEach((c) => {
          (str += c), (interval += 100), (proceed += 1);
        });

        insertString((gTextCursor += proceed), str);
      }
    }
  }

  if (gMessage.length <= gTextCursor) {
    if (gAlreadyTrick) {
      var str = "";
      sampleString(["っ", "…", "ッ"], 0.5).forEach((c) => {
        (str += c), (interval += 100), (proceed += 1);
      });
      insertString(gTextCursor, insertExclamation(str));
    }

    gTextCursor = gMessage.length;
    gFinish = true;
  }
  if (!gFinish) {
    gIntervalTimer = setTimeout(update, gNextInterval);
    gNextInterval = interval;
    gTextCursor++;
  }

  output_area.innerHTML = gMessage.substring(0, gTextCursor);
}

function trick() {
  var last_char = gMessage[gTextCursor - 1];

  var is_hit = false;

  var last_char_kind = "該当なし";
  if (
    "あかがさざただなはばまやらわアカガサザタダナハバマヤラワ".includes(
      last_char
    )
  ) {
    last_char_kind = "あ";
  } else if (
    "いきぎしじちぢにひびみりイキギシジチヂニヒビミリ".includes(last_char)
  ) {
    last_char_kind = "い";
  } else if (
    "うくぐすずつづぬふぶむゆるウクグスズツヅヌフブムユル".includes(last_char)
  ) {
    last_char_kind = "う";
  } else if (
    "えけげせぜてでねへべめれエケゲセゼテデネヘベメレ".includes(last_char)
  ) {
    last_char_kind = "え";
  } else if ("んン".includes(last_char)) {
    last_char_kind = "ん";
  }
  if (document.getElementById("OhMode").checked) {
    last_char_kind = "お";
  }

  var reaction = gReactionTable[last_char_kind];
  if (reaction && reaction.length > 0) {
    is_hit = true;
    var idx = Math.floor(Math.random() * reaction.length);
    var str = reaction[idx];
    if (gBreath < 5) str += "…";
    if (Math.random() < 0.2) str += last_char;
    insertString(gTextCursor, insertExclamation(str));
  } else if (!"、。？！・".includes(last_char)) {
    is_hit = true;
    if (Math.random() < 0.15) {
      var str = "っ";
      if (Math.random() < 0.2) str += "…";
      sampleString(
        checked_oh()
          ? ["おっ", "んっ", "うっ", "ほっ", "おっ"]
          : [("やっ", "あっ", "めっ", "くっ", "はっ")],
        0.1
      ).forEach((c) => {
        str += c;
      });

      if (gBreath < 5) str += "…";
      if (Math.random() < 0.2) str += last_char;

      insertString(gTextCursor, insertExclamation(str));
    }
  }

  if (checked_declare() && gTension > 250 && Math.random() < 0.25) {
    var str = "";
    sampleString(["っ", "…", "ッ"], 0.25).forEach((c) => {
      str += c;
    });
    str += "イきました";
    sampleString(["あ", "あ゛", "っ", "ッ", "…"], 0.25).forEach((c) => {
      str += c;
    });
    insertString(gTextCursor, insertExclamation(str));
  }

  if (Math.random() < 0.25) {
    var top = gTextCursor - Math.floor(Math.random() * 10);
    if (top < 0) top = 0;
    var end = gTextCursor;
    var str = gMessage.substring(top, end);
    var proceed = 0;
    if (Math.random() < 0.25) (str += "…ッ"), (proceed += 1);
    if (Math.random() < 0.75) (str += "…"), (proceed += 0);
    insertString(gTextCursor, str);
    gTextCursor += proceed;
  }

  gPrevTension = gTension;
  if (is_hit) {
    gTension += checked_supertrick() ? 500 : 50;
    gBreath -= 30;
    gTrickReserve = false;
  }
}
