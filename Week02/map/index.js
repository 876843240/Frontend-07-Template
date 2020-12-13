let map = localStorage.getItem("map") ? JSON.parse(localStorage.getItem("map")) : Array(10000).fill(0);
let container = document.querySelector("#container");
let fragment = document.createDocumentFragment();
class Sorted{
    constructor(data,compare){
        this.data = data.slice();
        this.compare = compare || ((a,b)=>a - b);
    }
    take(){
        if(!this.data.length)
            return;
        let min = this.data[0];
        let minIndex = 0;

        for(var i = 0;i < this.data.length;i++){
            if(this.compare(this.data[i],min) <= 0){
                min = this.data[i];
                minIndex = i;
            }
        }


        this.data.splice(minIndex,1);
        return min;
    }
    give(v){
        this.data.push(v);
    }
    // get(){
    //     return this.data;
    // }
}

let k = new Sorted([1,2,23,4,23,123])

function draw() {
    for (let y = 0; y < 100; y++) {
        for (let x = 0; x < 100; x++) {
            let cell = document.createElement("div");
            cell.className = 'cell';

            if (map[100 * y + x] == 1)
                cell.style.backgroundColor = 'black';
            cell.addEventListener("mousemove", () => {
                if (mousedown) {
                    if (clean) {
                        cell.style.backgroundColor = '';
                        map[100 * y + x] = 0;
                    } else {
                        cell.style.backgroundColor = "black";
                        map[100 * y + x] = 1;
                    }

                }
            }, false);
            fragment.appendChild(cell);
        }
    }
    container.appendChild(fragment);
}
draw();

function sleep(t) {
    return new Promise(function(resolve) {
        setTimeout(resolve, t);
    })
}
async function findPath(map, start, end) {
    let table = Object.create(map);
    let queue = new Sorted([start],(a,b)=>distance(a) - distance(b));

    async function insert(x, y, pre) {
        if (x < 0 || x >= 100 || y < 0 || y >= 100)
            return;
        if (table[100 * y + x])
            return;
        await sleep(30);
        container.children[y * 100 + x].style.backgroundColor = '#ff0000';
        table[y * 100 + x] = pre;
        queue.give([x, y]);
    }
    function distance(point){
        return (point[0] - end[0]) ** 2 + (point[1] - end[1]) ** 2;
    }
    while (queue.data.length) {
        let [x, y] = queue.take();

        if (x === end[0] && y === end[1]) {
            let path = [];
            while (x !== start[0] || y !== start[1]) {
                path.push(map[y * 100 + x]);
                [x, y] = table[y * 100 + x];
                await sleep(30);
                container.children[y * 100 + x].style.backgroundColor = '#ff00ff';
            }
            return path;
        }
        await insert(x + 1, y, [x, y]);
        await insert(x - 1, y, [x, y]);
        await insert(x, y - 1, [x, y]);
        await insert(x, y + 1, [x, y]);
        await insert(x + 1, y + 1, [x, y]);
        await insert(x - 1, y + 1, [x, y]);
        await insert(x - 1, y + 1, [x, y]);
        await insert(x - 1, y - 1, [x, y]);
    }
}

let mousedown = false;
let clean = false;
document.addEventListener("mousedown", e => {
    mousedown = true;
    clean = (e.which === 3);
}, false);

document.addEventListener("mouseup", () => mousedown = false);
document.addEventListener("contentmenu", e => e.preventDefault());

document.querySelector("#saveDataBtn").addEventListener("click", function() {
    localStorage.setItem("map", JSON.stringify(map));
}, false);