const canvas = document.getElementById("timelineCanvas");
const ctx = canvas.getContext("2d");

document
.getElementById("jsonFile")
.addEventListener("change", loadJson);

function loadJson(event) {
const file = event.target.files[0];

if (!file) return;

const reader = new FileReader();

reader.onload = function (e) {
const data = JSON.parse(e.target.result);

```
drawTable(data);
```

};

reader.readAsText(file);
}

function drawTable(data) {

ctx.clearRect(0, 0, canvas.width, canvas.height);

const leftWidth = 120;
const rightWidth = 100;

const topHeight = 60;

const rowCount = 8;
const rowHeight = 90;

const tableWidth =
canvas.width - leftWidth - rightWidth;

const tableLeft = leftWidth;
const tableRight = canvas.width - rightWidth;

const tableTop = topHeight;
const tableBottom = topHeight + rowHeight * 7;

ctx.strokeStyle = "#000";
ctx.lineWidth = 1;

for (let i = 0; i <= 7; i++) {
const y = topHeight + i * rowHeight;

```
ctx.beginPath();
ctx.moveTo(0, y);
ctx.lineTo(canvas.width, y);
ctx.stroke();
```

}

ctx.beginPath();
ctx.moveTo(leftWidth, 0);
ctx.lineTo(leftWidth, tableBottom);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(tableRight, 0);
ctx.lineTo(tableRight, tableBottom);
ctx.stroke();

const startHour = parseInt(
data.timeline.start.split(":")[0]
);

const endHour = parseInt(
data.timeline.end.split(":")[0]
);

const totalHours = endHour - startHour;

for (let i = 0; i <= totalHours; i++) {

```
const x =
  tableLeft +
  (tableWidth * i) / totalHours;

ctx.setLineDash([6, 6]);

ctx.beginPath();
ctx.moveTo(x, topHeight);
ctx.lineTo(x, tableBottom);
ctx.stroke();

ctx.setLineDash([]);

if (i < totalHours) {
  ctx.textAlign = "center";
  ctx.fillText(
    `${startHour + i}:00`,
    x,
    25
  );
}
```

}

data.week.forEach((day, index) => {

```
const y =
  topHeight + rowHeight * index + rowHeight / 2;

const date = new Date(day.date);

const weekdays = [
  "日",
  "月",
  "火",
  "水",
  "木",
  "金",
  "土"
];

ctx.textAlign = "center";

ctx.fillText(
  `${date.getMonth() + 1}/${date.getDate()}`,
  leftWidth / 2,
  y - 10
);

ctx.fillText(
  weekdays[date.getDay()],
  leftWidth / 2,
  y + 15
);
```

});

}
