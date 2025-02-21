import dayjs from "dayjs"

export const newActions = [[
    {
      label: "New Trades",
      icon: "i-heroicons-plus",
      to: "/1",
    },
    {
      label: "New Diary",
      icon: "i-heroicons-plus",
      to: "/2",
    },
    {
      label: "New Screenshot",
      icon: "i-heroicons-plus",
      to: "/3",
    },
    {
      label: "New Playbook",
      icon: "i-heroicons-plus",
      to: "/4",
    },
    {
      label: "New Backtest",
      icon: "i-heroicons-plus",
      to: "/5",
    }
]];


export const getRandomHexColor = () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  const hexColor = "#" + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1);
  return hexColor;
};

export const getGreeting = (param) => {
  const currentTime = +dayjs().format("HH");

  const emojis = [
    '😄','😃','😀','😊','😉','😜','😝','😁','😎','😇','😏'
  ];

  if (currentTime >= 6 && currentTime < 12) {
    return "Good morning, " + param + " " + emojis[Math.floor(Math.random() * emojis.length)];
  } else if (currentTime >= 12 && currentTime < 18) {
    return "Good afternoon, " + param + " " + emojis[Math.floor(Math.random() * emojis.length)];
  } else if (currentTime >= 18 && currentTime < 22) {
    return "Good evening, " + param + " " + emojis[Math.floor(Math.random() * emojis.length)];
  } else {
    return "Good night, " + param + " " + emojis[Math.floor(Math.random() * emojis.length)];
  }
};

export const pluck = (arr, keys) => arr && arr.map(i => keys.map(k => i[k])[0]);

export function weekCount(year = '2025', month_number = '1') {
  var firstOfMonth = new Date(year, month_number - 1, 1);
  var day = firstOfMonth.getDay() || 6;
  day = day === 1 ? 0 : day;
  if (day) { day-- }
  var diff = 7 - day;
  var lastOfMonth = new Date(year, month_number, 0);
  var lastDate = lastOfMonth.getDate();
  if (lastOfMonth.getDay() === 1) {
      diff--;
  }
  var result = Math.ceil((lastDate - diff) / 7);
  return result + 1;
}

let randomNameList = [
  'Time','Past','Future','Dev',
  'Fly','Flying','Soar','Soaring','Power','Falling',
  'Fall','Jump','Cliff','Mountain','Rend','Red','Blue',
  'Green','Yellow','Gold','Demon','Demonic','Panda','Cat',
  'Kitty','Kitten','Zero','Memory','Trooper','XX','Bandit',
  'Fear','Light','Glow','Tread','Deep','Deeper','Deepest',
  'Mine','Your','Worst','Enemy','Hostile','Force','Video',
  'Game','Donkey','Mule','Colt','Cult','Cultist','Magnum',
  'Gun','Assault','Recon','Trap','Trapper','Redeem','Code',
  'Script','Writer','Near','Close','Open','Cube','Circle',
  'Geo','Genome','Germ','Spaz','Shot','Echo','Beta','Alpha',
  'Gamma','Omega','Seal','Squid','Money','Cash','Lord','King',
  'Duke','Rest','Fire','Flame','Morrow','Break','Breaker','Numb',
  'Ice','Cold','Rotten','Sick','Sickly','Janitor','Camel','Rooster',
  'Sand','Desert','Dessert','Hurdle','Racer','Eraser','Erase','Big',
  'Small','Short','Tall','Sith','Bounty','Hunter','Cracked','Broken',
  'Sad','Happy','Joy','Joyful','Crimson','Destiny','Deceit','Lies',
  'Lie','Honest','Destined','Bloxxer','Hawk','Eagle','Hawker','Walker',
  'Zombie','Sarge','Capt','Captain','Punch','One','Two','Uno','Slice',
  'Slash','Melt','Melted','Melting','Fell','Wolf','Hound',
  'Legacy','Sharp','Dead','Mew','Chuckle','Bubba','Bubble','Sandwich','Smasher','Extreme','Multi','Universe','Ultimate','Death','Ready','Monkey','Elevator','Wrench','Grease','Head','Theme','Grand','Cool','Kid','Boy','Girl','Vortex','Paradox'
]

export function getRandomNameString() {
  let a = randomNameList[Math.floor( Math.random() * randomNameList.length )];
  let b = randomNameList[Math.floor( Math.random() * randomNameList.length )];
  return a + " " + b
};

/**
 * Return true of false if an object is empty or not
 */
export function isObjectEmpty(_Object) {
    return !_Object || Object.keys(_Object).length === 0 && _Object.constructor === Object
}

function hexToRgba(colour, alpha = 1) {
    const [r, g, b] = colour.match(/\w\w/g).map(x => parseInt(x, 16))
    return `rgb(${r},${g},${b})`
}

function getRgb(color) {
  let [r, g, b] = color.replace('rgb(', '')
    .replace(')', '')
    .split(',')
    .map(str => Number(str));;
  return {
    r,
    g,
    b
  }
}

export function colorInterpolate(colorA, colorB, intval) {
  const rgbA = getRgb(hexToRgba(colorA)),
    rgbB = getRgb(hexToRgba(colorB));
  const colorVal = (prop) =>
    Math.round(rgbA[prop] * (1 - intval) + rgbB[prop] * intval) ;
  return 'rgb('+ colorVal('r') + ',' + colorVal('g') + ',' + colorVal('b') + ')'
}

export function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;
    G = (G<255)?G:255;
    B = (B<255)?B:255;

    R = Math.round(R)
    G = Math.round(G)
    B = Math.round(B)

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}
