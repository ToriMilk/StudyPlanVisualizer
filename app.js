const canvas = document.getElementById("timelineCanvas");
const ctx = canvas.getContext("2d");

document
.getElementById("jsonFile")
.addEventListener("change", loadJson);

function loadJson(event){


const file = event.target.files[0];

if(!file){
    return;
}

const reader = new FileReader();

reader.onload = function(e){

    const data = JSON.parse(e.target.result);

    drawTable(data);

};

reader.readAsText(file);


}

function formatDuration(minutes){


const h = Math.floor(minutes / 60);
const m = minutes % 60;

if(h === 0){
    return `${m}m`;
}

if(m === 0){
    return `${h}h`;
}

return `${h}h${m}m`;


}

function timeToMinutes(timeStr){

const [h,m] = timeStr.split(":").map(Number);

return h * 60 + m;


}

function drawTable(data){

ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
);

const W = canvas.width;
const H = canvas.height;

const leftCol = 70;
const rightCol = 70;

const headerHeight = 60;

const bodyHeight =
    H - headerHeight - 20;

const rowHeight =
    bodyHeight / 7;

const timelineLeft = leftCol;
const timelineRight = W - rightCol;
const timelineWidth =
    timelineRight - timelineLeft;

const startMin =
    timeToMinutes(
        data.timeline.start
    );

const endMin =
    timeToMinutes(
        data.timeline.end
    );

const totalMin =
    endMin - startMin;

ctx.strokeStyle = "#000";
ctx.lineWidth = 1;

// 横線

for(let i=1;i<=7;i++){

    const y =
        headerHeight +
        i * rowHeight;

    ctx.beginPath();
    ctx.moveTo(0,y);
    ctx.lineTo(W,y);
    ctx.stroke();
}

// A列右

ctx.beginPath();
ctx.moveTo(leftCol,0);
ctx.lineTo(leftCol,H);
ctx.stroke();

// S列左

ctx.beginPath();
ctx.moveTo(W-rightCol,0);
ctx.lineTo(W-rightCol,H);
ctx.stroke();

// 時間線

for(
    let m=startMin;
    m<=endMin;
    m+=30
){

    const ratio =
        (m-startMin)/totalMin;

    const x =
        timelineLeft +
        ratio * timelineWidth;

    if(m % 60 === 0){

        ctx.setLineDash([8,6]);
        ctx.strokeStyle="#000";

    }else{

        ctx.setLineDash([3,6]);
        ctx.strokeStyle="#999";
    }

    ctx.beginPath();
    ctx.moveTo(x,headerHeight);
    ctx.lineTo(x,H);
    ctx.stroke();

    if(m % 60 === 0){

        const hh =
            Math.floor(m/60);

        ctx.fillStyle="#000";
        ctx.textAlign="center";

        ctx.fillText(
            `${hh}:00`,
            x,
            25
        );
    }
}

ctx.setLineDash([]);

// 合計

ctx.textAlign="center";

ctx.fillText(
    "合計",
    W-rightCol/2,
    30
);

// 日付

const weekdays = [
    "日",
    "月",
    "火",
    "水",
    "木",
    "金",
    "土"
];

data.week.forEach(
    (day,index)=>{

    const y =
        headerHeight +
        rowHeight*index +
        rowHeight/2;

    const d =
        new Date(day.date);

    ctx.fillStyle="#000";

    ctx.fillText(
        `${d.getMonth()+1}/${d.getDate()}`,
        leftCol/2,
        y-10
    );

    ctx.fillText(
        weekdays[d.getDay()],
        leftCol/2,
        y+15
    );

    let total = 0;

    day.plans.forEach(plan=>{

        total +=
            timeToMinutes(plan.end)
            -
            timeToMinutes(plan.start);

    });

    ctx.fillText(
        formatDuration(total),
        W-rightCol/2,
        y+5
    );

});

}
