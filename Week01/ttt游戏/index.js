(function() {
    let pattern = [0, 0, 0,
        0, 0, 0,
        0, 0, 0
    ];
    let color = 1;
    let isEnd = false;
    let $result = document.querySelector("#result");
    let $container = document.querySelector("#container");
    let $startPosInput = document.querySelector("#currStartPos");
    // 初始化
    function show() {
        let fragment = document.createDocumentFragment();
        let div;
        document.querySelector("#startSceen").style.display = 'none';
        for (let index = 0; index < pattern.length; index++) {
            div = document.createElement("div");
            div.className = 'box';
            div.setAttribute("data-index", index);
            fragment.appendChild(div);
            renderUser(div, pattern[index]);
        }
        $container.style.display = "block";
        $container.innerHTML = "";
        $container.appendChild(fragment)
    }

    // 渲染当前的点击的按钮
    function renderUser(div, state) {
        if (state === 0) {
            return false;
        } else {
            div.innerText = state === 1 ? '⚪' : 'x';
        }
    }

    function handleClick(e) {
        let target = e.target;

        if (target.id === "startBtn") {
            startGame();
        }
        if (target.id === "reloadBtn") {
        	resetState();
        }

        if (target.classList.contains("box")) {
            clickBox(target);
        }


    }

    function clickBox(target) {
        if (isEnd) {
            return false;
        }
        let currIndex;

        currIndex = target.dataset.index;
        if(target.classList.contains("set")){
        	return false;
        }
        pattern[currIndex] = color;
        target.classList.add("set");
        // console.log(color);
        if (check(pattern, color)) {
            showResult(color,target);
        } else {
        	let isEndGame = true;
            for(let index = 0;index < pattern.length;index++){
            	if(!pattern[index]){
            		isEndGame  = false;
            		break;
            	}
                
            }
            if(isEndGame){
            	 showResult(0,target);
            }
        }
        color = 3 - color;

        renderUser(target, color);
    }

    function showResult(color,target) {
        var currWinnerStr = "";
        isEnd = true;
        target.parentNode.classList.add("end");
        $result.style.display = "block";
        if (color) {
            currWinnerStr = "赢家是" + (color === 2 ? '⚪' : 'x');
        } else {
            currWinnerStr = "平局";
        }
        $result.querySelector(".result-tips").innerText = currWinnerStr;
    }

    function computeMove() {
        let choice = bestChoice(pattern, color);

        if (choice.point)
            pattern[choice.point[1] * 3 + choice.point[0]] = color;

        color = 3 - color;
        // renderUser(, color);
    }

    function check(arr, color) {
        {
            for (let i = 0; i < 3; i++) {
                let win = true;
                for (let j = 0; j < 3; j++) {

                    if (arr[i * 3 + j] !== color) {
                        win = false;
                    }
                }
                if (win)
                    return true;
            }

        } {
            for (let i = 0; i < 3; i++) {
                let win = true;
                for (let j = 0; j < 3; j++) {
                    if (arr[j * 3 + i] !== color) {
                        win = false;
                    }
                }
                if (win)
                    return true;
            }

        } {
            let win = true;
            for (let j = 0; j < 3; j++) {
                if (arr[2 * (j + 1)] !== color) {
                    win = false;
                }
            }
            if (win)
                return true;
        } {
            let win = true;
            for (let j = 0; j < 3; j++) {
                if (arr[j * 4] !== color) {
                    win = false;
                }
            }
            if (win)
                return true;
        }
        return false;

    }

    function clone(obj) {
        return Object.create(obj);
    }

    function bestChoice(pattern, color) {
        let p;
        let result = -2;
        let point = null;
        if (p = willWin(pattern, color)) {
            return {
                point: 0,
                result: 1
            }
        }
        for (let i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {
                if (pattern[i * 3 + j])
                    continue;
                let temp = clone(pattern);
                temp[i * 3 + j] = color;
                let r = bestChoice(temp, 3 - color).result;
                if (-r > result) {
                    retult = -r;
                    point = [j, i];
                }
            }
        }
        return {
            point: point,
            result: point ? result : 0
        }
    }

    function willWin(pattern, color) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (pattern[i * 3 + j])
                    continue;
                let temp = clone(pattern);
                temp[i * 3 + j] = color;
                if (check(temp, color)) {
                    return [j, i];
                }
            }
        }
        return null;
    }

    function selectPos() {
        // var ans = window.prompt("请输入你想要开始的位置，1是⚪，2是x");

        //    ans = parseInt(ans);
        // if(ans === 1 ||  ans === 2){
        // 	return ans;

        // }else{
        // 	selectPos();
        // }
    }
    document.addEventListener("click", handleClick, false);

    function resetState() {
        for (var i = 0; i < pattern.length; i++) {
            pattern[i] = 0;
        }
        $container.style.display = "none";
        $container.classList.remove("end");
        document.querySelector("#startSceen").style.display = "block";
        isEnd = false;
        $result.style.display = "none";
    }

    function startGame() {
        color = $startPosInput.value;

        color = parseInt(color);
        $startPosInput.value = "";
        if (color !== 1 && color !== 2) {
            alert("请输入:1代表x 2代表⚪ ");
            return false;
        }
        show();
    }

})();