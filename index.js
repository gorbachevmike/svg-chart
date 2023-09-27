import './style.css';

const FAKE_DATA = [
  {
    id: 1,
    percent: 10,
    color: '#98C1D9',
    label: 'Item 1',
  },
  {
    id: 2,
    percent: 10,
    color: 'red',
    label: 'Item 2',
  },
  {
    id: 3,
    percent: 10,
    color: 'blue',
    label: 'Item 3',
  },
  {
    id: 3,
    percent: 10,
    color: 'DodgerBlue',
    label: 'Item 3',
  },
  {
    id: 1,
    percent: 10,
    color: 'DarkSeaGreen',
    label: 'Item 1',
  },
  {
    id: 2,
    percent: 10,
    color: 'red',
    label: 'Item 2',
  },
  {
    id: 3,
    percent: 10,
    color: 'blue',
    label: 'Item 3',
  },
  {
    id: 3,
    percent: 10,
    color: 'DodgerBlue',
    label: 'Item 3',
  },
  {
    id: 3,
    percent: 10,
    color: '#EE6C4D',
    label: 'Item 3',
  },
  {
    id: 3,
    percent: 10,
    color: '#E0FBFC',
    label: 'Item 3',
  },
];

const viewbox = 100;
const radius = 50;
const borderSize = 20;

const percentToDegrees = (percent) => {
  return percent * 3.6 === 360 ? 359.99 : percent * 3.6;
};

const getCoordFromDegrees = (angle, radius, svgSize) => {
  const x = Math.cos((angle * Math.PI) / 180);
  const y = Math.sin((angle * Math.PI) / 180);
  const coordX = x * radius + svgSize / 2;
  const coordY = y * -radius + svgSize / 2;
  return [coordX, coordY].join(' ');
};

const getSlicesWithCommandsAndOffsets = (
  donutSlices,
  radius,
  svgSize,
  borderSize
) => {
  let previousPercent = 0;
  return donutSlices.map((slice) => {
    const sliceWithCommands = {
      ...slice,
      commands: getSliceCommands(slice, radius, svgSize, borderSize),
      offset: previousPercent * 3.6 * -1,
    };
    previousPercent += slice.percent;
    return sliceWithCommands;
  });
};

const getSliceCommands = (slice, radius, svgSize, borderSize) => {
  const degrees = percentToDegrees(slice.percent);
  const longPathFlag = degrees > 180 ? 1 : 0;
  const innerRadius = radius - borderSize;

  const commands = [];
  commands.push(`M ${svgSize / 2 + radius} ${svgSize / 2}`);
  commands.push(
    `A ${radius} ${radius} 0 ${longPathFlag} 0 ${getCoordFromDegrees(
      degrees,
      radius,
      svgSize
    )}`
  );
  commands.push(`L ${getCoordFromDegrees(degrees, innerRadius, svgSize)}`);
  commands.push(
    `A ${innerRadius} ${innerRadius} 0 ${longPathFlag} 1 ${
      svgSize / 2 + innerRadius
    } ${svgSize / 2}`
  );
  return commands.join(' ');
};

const svg = document.getElementById('svg');

svg.setAttribute('viewBox', `0 0 ${viewbox} ${viewbox}`);

const paths = getSlicesWithCommandsAndOffsets(
  FAKE_DATA,
  radius,
  viewbox,
  borderSize
);

paths.forEach((slice) => {
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
  title.textContent = slice.label;

  p.setAttribute('fill', slice.color);
  p.setAttribute('d', slice.commands);
  p.setAttribute('transform', `rotate(${slice.offset})`);

  p.append(title);

  svg.append(p);
});
