// TODO: 이 곳에 정답 코드를 작성해주세요.
import stopwatch from './stopwatch.js'

class StopWatcher {
    $startButton
    $resetButton
    stopWatch
    $timer
    $startButtonLabel
    $resetButtonLabel
    $laps
    $isStart = false
    $_interval
    labCount
    lapTimeArray = []
    maxLapTime = 0
    minLabTime = 0
    constructor(stopWatchInstance) {
        this.assignElement()
        this.handleDomEvent()
        this.stopWatch = stopWatchInstance
        // this.labCount = stopWatch._lapCount
    }

    assignElement() {
        this.$startButton = document.getElementById('start-stop-btn')
        this.$resetButton = document.getElementById('lap-reset-btn')
        this.$timer = document.getElementById('timer')
        this.$startButtonLabel = this.$startButton.querySelector(
            '#start-stop-btn-label'
        )
        this.$resetButtonLabel = this.$resetButton.querySelector(
            '#lap-reset-btn-label'
        )
        this.$laps = document.getElementById('laps')
    }

    handleDomEvent() {
        this.$startButton.addEventListener(
            'click',
            this.handleInitTime.bind(this)
        )
        this.$resetButton.addEventListener(
            'click',
            this.handleResetTime.bind(this)
        )
        window.addEventListener('keydown', this.handleKeyDown.bind(this))
    }

    handleInitTime() {
        if (!this.$isStart) {
            this.stopWatch.start()
            this.$isStart = true
            this.$startButton.classList.remove('bg-green-600')
            this.$startButton.classList.add('bg-red-600')
            this.$startButtonLabel.innerText = '중단'
            this.$resetButtonLabel.innerText = '랩'
            this.$_interval = setInterval(() => {
                this.$timer.innerText = this.calculateTime(
                    this.stopWatch.centisecond
                )
            }, 10)
        } else {
            this.$isStart = false
            this.$startButton.classList.remove('bg-red-600')
            this.$startButton.classList.add('bg-green-600')
            this.$startButtonLabel.innerText = '시작'
            this.$resetButtonLabel.innerText = '리셋'
            this.stopWatch.pause()
            clearInterval(this.$_interval)
        }
    }

    handleResetTime() {
        // 타이머가 가고 있는 상황 랩을 기록해야함.
        // this.labCount =
        if (this.$isStart) {
            const [labCount, lapTime] = this.stopWatch.createLap()
            this.lapTimeArray.push(lapTime)
            this.maxLapTime = Math.max(...this.lapTimeArray)
            this.minLabTime = Math.min(...this.lapTimeArray)

            // ul 태그 하위의 자식들중에
            const template = `
                    <li data-item=${lapTime} class="flex justify-between py-2 px-3 border-b-2">
                        <span>랩 ${labCount}</span>
                        <span>${this.calculateTime(
                            this.stopWatch.centisecond
                        )}</span>
                    </li>`
            this.$laps.insertAdjacentHTML('afterbegin', template)

            const listArray = [...this.$laps.querySelectorAll('li')]
            listArray
                .filter((item) => item.dataset.item !== this.maxLapTime)
                .forEach((item) => item.classList.remove('text-red-600'))

            listArray
                .find((item) => item.dataset.item == this.maxLapTime)
                .classList.add('text-red-600')

            listArray
                .filter((item) => item.dataset.item !== this.minLabTime)
                .forEach((item) => item.classList.remove('text-green-600'))
            listArray
                .find((item) => item.dataset.item == this.minLabTime)
                .classList.add('text-green-600')

            // 타이머가 멈춘 상황 시간을 리셋해야함.
        } else {
            this.stopWatch.reset()
            this.$timer.innerText = this.calculateTime(
                this.stopWatch.centisecond
            )
            this.lapTimeArray = []
            while (this.$laps.firstChild) {
                this.$laps.removeChild(this.$laps.lastChild)
            }
        }
    }

    handleKeyDown(e) {
        if (e.key === 's' || e.key === 'ㄴ') {
            this.handleInitTime()
        }

        if (e.key === 'l' || e.key === 'ㅣ') {
            this.handleResetTime()
        }
    }

    formatString(num) {
        return num < 10 ? '0' + num : num
    }

    calculateTime(centisecond) {
        let formatString = ''
        const min = parseInt(centisecond / 6000)
        const sec = parseInt((centisecond - 6000 * min) / 100)
        const centisec = centisecond % 100
        formatString = `${this.formatString(min)}:${this.formatString(
            sec
        )}.${this.formatString(centisec)}`

        return formatString
    }
}

new StopWatcher(stopwatch)

// 랩을 클릭하면
// 현재 가지고 있는 li 태그들을 가져온다.
// classList 'text-green-600', 와 'text-red-600'을 빼준다.
// hasMax가 있으면 classList 'text-green-600'추가
