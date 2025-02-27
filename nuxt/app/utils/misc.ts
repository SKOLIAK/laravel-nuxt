import dayjs from 'dayjs'

export const getGreeting = (param: string) => {
  const currentTime = +dayjs().format("HH");

  const emojis = [
    '👋', '😉', '😎', '👽', '🫡'
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