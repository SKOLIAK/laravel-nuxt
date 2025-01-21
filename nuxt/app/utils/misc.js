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
