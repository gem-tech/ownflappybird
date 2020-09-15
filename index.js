// 用对象收编变量

var bird = {
    skyPosition: 0,
    skyMoved: 2,
    birdTop: 235,
    birdX: 0,
    startColor: 'white',
    startflag: false,
    birdStepY: 0,
    minTop: 0,
    maxTop: 570,
    pipeLength: 7,
    pipeArr: [],
    score: 0,
    scoreArr: [],
    pipeLastIndex: 6,
    init: function () {
        document.documentElement.onselectstart = function () {
            return false;
        }
        this.initData();
        this.animate();
        this.handleStart();
        this.handleClick();
        this.handleRestart();
        if (getSession('play') === 'true') {
            this.start();
        }
    },
    initData: function () {
        // this指向>bird
        this.el = document.getElementById('game');
        this.oBird = this.el.getElementsByClassName('bird')[0];
        this.oStart = this.el.getElementsByClassName('start')[0];
        this.oScore = this.el.getElementsByClassName('score')[0];
        this.oMask = this.el.getElementsByClassName('mask')[0];
        this.oEnd = this.el.getElementsByClassName('end')[0];
        this.oFinalScore = this.el.getElementsByClassName('final-score')[0];
        this.oRankList = this.el.getElementsByClassName('rank-list')[0];
        this.oRestart = this.el.getElementsByClassName('restart')[0];
        this.scoreArr = this.getScore();
    },
    animate: function () {
        count = 0;//计数器，10的倍数的时候执行birdJump()
        this.timer = setInterval(() => {
            this.skyMove();
            if (this.startflag) {
                this.birdDrop();
                this.pipeMove();
            }
            if (++count % 10 === 0) {
                this.birdFly();
                if (!this.startflag) {
                    this.startBound();
                    this.birdJump();
                }
            }
        }, 30);
    },
    skyMove: function () {
        this.skyPosition -= this.skyMoved;
        this.el.style.backgroundPositionX = this.skyPosition + 'px';
    },
    birdJump: function () {
        this.birdTop = this.birdTop === 220 ? 260 : 220;
        this.oBird.style.top = this.birdTop + 'px';
    },
    birdFly: function () {
        this.birdX -= 30;
        this.oBird.style.backgroundPositionX = this.birdX + 'px';
    },
    birdDrop: function () {
        this.birdTop += ++this.birdStepY;
        this.oBird.style.top = this.birdTop + 'px';
        this.judgeKnock();
        this.addScore();
    },
    judgeKnock: function () {
        this.judgeBoundary();
        this.judgePipe();
    },
    judgeBoundary: function () {
        if (this.birdTop <= this.minTop || this.birdTop >= this.maxTop) {
            this.failGame();
        }
    },
    judgePipe: function () {
        var index = this.score % this.pipeLength; // 最前面一组柱子的索引
        var pipeX = this.pipeArr[index].up.offsetLeft //  获取柱子的 left值
        var pipeY = this.pipeArr[index].y;  // 获取上柱子底部的值 和 下柱子顶部的值
        var birdY = this.birdTop; // 获取小鸟的top值
        if ((pipeX <= 95 && pipeX >= 13) && (birdY <= pipeY[0] || birdY >= pipeY[1])) {
            this.failGame();
        }
    },
    creatPipe: function (x) {
        //上下距离固定值150
        var upHeight = 50 + Math.floor(Math.random() * 175);
        var downHeight = 450 - upHeight;
        var oUpPipe = createEle('div', ['pipe', 'pipe-up'], {
            height: upHeight + 'px',
            left: x + 'px'
        });
        var oDownPipe = createEle('div', ['pipe', 'pipe-down'], {
            height: downHeight + 'px',
            left: x + 'px'
        });

        this.el.appendChild(oUpPipe);
        this.el.appendChild(oDownPipe);
        this.pipeArr.push({
            up: oUpPipe,
            down: oDownPipe,
            y: [upHeight, upHeight + 150 - 30],
        });
    },
    startBound: function () {
        this.oStart.classList.remove('start-' + this.startColor);
        this.startColor = this.startColor === 'blue' ? 'white' : 'blue';
        this.oStart.classList.add('start-' + this.startColor);
    },
    pipeMove: function () {
        for (var i = 0; i < this.pipeLength; i++) {
            var oUpPipe = this.pipeArr[i].up;
            var oDownPipe = this.pipeArr[i].down;
            var x = oUpPipe.offsetLeft - this.skyMoved;

            if (x < -52) {
                // var pipeHeight = this.getPipeHeight(); // 获得每组柱子的高度
                // var upHeight = pipeHeight.up;  // 上柱子高度
                // var downHeight = pipeHeight.down; // 下柱子高度
                var lastPipeLeft = this.pipeArr[this.pipeLastIndex].up.offsetLeft; // 找规律(score+5)%7视图上最后一组柱子的left值
                // oUpPipe.style.height = upHeight + 'px';
                // oDownPipe.style.height = downHeight + 'px';
                oUpPipe.style.left = lastPipeLeft + 300 + 'px';
                oDownPipe.style.left = lastPipeLeft + 300 + 'px';
                this.pipeLastIndex = i;
                // this.pipeArr[i].y = [upHeight, upHeight + 150]; // 更改上柱子底部top值，以及下柱子顶部top值
                continue;
            }
            oUpPipe.style.left = x + 'px';
            oDownPipe.style.left = x + 'px';
        }
    },
    addScore: function () {
        var pipeX = this.pipeArr[this.score % this.pipeLength].up.offsetLeft;
        if (pipeX < 13) {
            this.oScore.innerText = ++this.score;
            this.lastPipeIndex = (this.score + this.pipeLength - 1 - 1) % this.pipeLength;
        }
    },
    // getPipeHeight: function () {
    //     var upHeight = 50 + Math.floor(Math.random() * 175);
    //     var downHeight = 600 - upHeight - 150;

    //     return {
    //         up: upHeight,
    //         down: downHeight,
    //     }
    // },
    start: function () {
        this.startflag = true;
        this.oStart.style.display = 'none';
        this.oScore.style.display = 'block';
        this.oBird.style.left = '80px';
        this.skyMoved = 5;
        this.oBird.style.transition = 'none';

        for (var i = 0; i < this.pipeLength; i++) {
            this.creatPipe(300 * (i + 1));
        }
    },
    handleStart: function () {
        this.oStart.onclick = () => {
            setSession('play', 'true');
            this.start();
        }
    },
    handleClick: function () {
        this.el.onclick = (e) => {
            var dom = e.target;
            var isStart = dom.classList.contains('start');
            if (!isStart) {
                this.birdStepY = -10;
            }
        };
    },
    handleRestart: function () {
        this.oRestart.onclick = function () {
            window.location.reload();
        }
    },
    failGame: function () {
        clearInterval(this.timer);
        this.setScore();
        this.oMask.style.display = 'block';
        this.oEnd.style.display = 'block';
        this.oScore.style.display = 'none';
        this.oFinalScore.innerText = this.score;
        this.renderRankList();
    },
    setScore: function () {
        this.scoreArr.push({
            score: this.score,
            time: this.getDate()
        });
        this.scoreArr.sort(function (a, b) {
            return b.score - a.score;
        });
        setLocal('score', this.scoreArr);
    },
    getScore: function () {
        var scoreArr = getLocal('score');
        return scoreArr ? scoreArr : [];
    },
    getDate: function () {
        var d = new Date();
        var year = formatNum(d.getFullYear());
        var month = formatNum(d.getMonth() + 1);
        var day = formatNum(d.getDate());
        var hour = formatNum(d.getHours());
        var minute = formatNum(d.getMinutes());
        var second = formatNum(d.getSeconds());

        return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
    },
    renderRankList: function () {
        var template = '';
        this.scoreArr.length = this.scoreArr.length > 8 ? 8 : this.scoreArr.length;
        for (var i = 0; i < this.scoreArr.length; i++) {
            var degreeClass = '';
            switch (i) {
                case 0:
                    degreeClass = 'first';
                    break;
                case 1:
                    degreeClass = 'second';
                    break;
                case 2:
                    degreeClass = 'third';
                    break;
            }
            template += `<li class="rank-item">
            <span class="rank-degree ${degreeClass}">${i + 1}</span>
            <span class="rank-score">${this.scoreArr[i].score}</span>
            <span class="time">${this.scoreArr[i].time}</span>
        </li>`
        }
        this.oRankList.innerHTML = template;
    },
};
bird.init();