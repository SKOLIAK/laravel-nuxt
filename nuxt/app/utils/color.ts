export const getRandomHexColor = () => {
  const red = Math.floor(Math.random() * 256)
  const green = Math.floor(Math.random() * 256)
  const blue = Math.floor(Math.random() * 256)
  const hexColor = "#" + ((1 << 24) + (red << 16) + (green << 8) + blue).toString(16).slice(1)

  return hexColor
};

export function colorInterpolate(colorA, colorB, intval) {
  const rgbA = getRgb(hexToRgba(colorA)),
    rgbB = getRgb(hexToRgba(colorB))

  const colorVal = (prop) =>
    Math.round(rgbA[prop] * (1 - intval) + rgbB[prop] * intval)

  return 'rgb(' + colorVal('r') + ',' + colorVal('g') + ',' + colorVal('b') + ')'
}

export function shadeColor(color: string, percent: number) {

  var R = parseInt(color.substring(1, 3), 16)
  var G = parseInt(color.substring(3, 5), 16)
  var B = parseInt(color.substring(5, 7), 16)

  R = parseInt(String(R * (100 + percent) / 100))
  G = parseInt(String(G * (100 + percent) / 100))
  B = parseInt(String(B * (100 + percent) / 100))

  R = (R < 255) ? R : 255;
  G = (G < 255) ? G : 255;
  B = (B < 255) ? B : 255;

  R = Math.round(R)
  G = Math.round(G)
  B = Math.round(B)

  var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
  var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
  var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
}

function hexToRgba(colour, alpha = 1) {
  const [r, g, b] = colour.match(/\w\w/g).map(x => parseInt(x, 16))
  return `rgb(${r},${g},${b})`
}

function getRgb(color) {
  let [r, g, b] = color.replace('rgb(', '')
    .replace(')', '')
    .split(',')
    .map(str => Number(str))

  return {
    r,
    g,
    b
  }
}