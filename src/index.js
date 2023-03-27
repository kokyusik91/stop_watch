// TODO: 이 곳에 정답 코드를 작성해주세요.
import stopwatch from './stopwatch.js'

class StopWatcher {
    $startButton
    $resetButton
    stopWatchInstance
    $timer
    $startButtonLabel
    $resetButtonLabel
    $laps
    isRunning = false
    interval
    labCount
    lapTimeArray = []
    maxLapTime
    minLabTime
    constructor(stopWatchInstance) {
        this.assignElement()
        this.handleDomEvent()
        this.stopWatchInstance = stopWatchInstance
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
            this.onClickStartBtn.bind(this)
        )
        this.$resetButton.addEventListener(
            'click',
            this.handleResetTime.bind(this)
        )
        window.addEventListener('keydown', this.handleKeyDown.bind(this))
    }

    onClickStartBtn() {
        if (!this.isRunning) {
            this.stopWatchInstance.start()
            this.interval = setInterval(() => {
                this.handleUpdateTime(
                    this.calculateTime(this.stopWatchInstance.centisecond)
                )
            }, 10)

            this.$startButtonLabel.innerText = '중단'
            this.$resetButtonLabel.innerText = '랩'
        } else {
            this.stopWatchInstance.pause()
            clearInterval(this.interval)
            this.$startButtonLabel.innerText = '시작'
            this.$resetButtonLabel.innerText = '리셋'
        }
        this.isRunning = !this.isRunning
        this.toggleBtnStyle()
    }

    handleResetTime() {
        // 타이머가 가고 있는 상황 랩을 기록해야함.
        // this.labCount =
        if (this.isRunning) {
            const [labCount, lapTime] = this.stopWatchInstance.createLap()
            const $lapItem = document.createElement('li')
            $lapItem.setAttribute('data-time', lapTime)
            $lapItem.classList.add(
                'flex',
                'justify-between',
                'py-2',
                'px-3',
                'border-b-2'
            )
            $lapItem.innerHTML = `
              <span>랩 ${labCount}</span>
                  <span>${this.calculateTime(
                      this.stopWatchInstance.centisecond
                  )}</span>
            `
            this.$laps.prepend($lapItem)
            // 첫 값은 minLab이다.
            if (this.minLabTime === undefined) {
                this.minLabTime = $lapItem

                return
            }
            // 두 번째 눌렸을때는 maxLabTime이 undefined이다. minLabTime은 위에서 $lapㅑㅅ드
            if (this.maxLapTime === undefined) {
                if (lapTime < this.minLabTime.dataset.time) {
                    this.maxLapTime = this.minLabTime
                    this.minLabTime = $lapItem
                } else {
                    this.maxLapTime = $lapItem
                }
                this.minLabTime.classList.add('text-green-600')
                this.maxLapTime.classList.add('text-red-600')
                return
            }

            // 랩이 3개인 경우
            if (lapTime < this.minLabTime.dataset.time) {
                this.minLabTime.classList.remove('text-green-600')
                this.minLabTime = $lapItem
            } else if (lapTime > this.maxLapTime.dataset.time) {
                this.maxLapTime.classList.remove('text-red-600')
                this.maxLapTime = $lapItem
            }

            this.minLabTime.classList.add('text-green-600')
            this.maxLapTime.classList.add('text-red-600')
        } else {
            this.stopWatchInstance.reset()
            this.$timer.innerText = this.calculateTime(
                this.stopWatchInstance.centisecond
            )
            this.maxLapTime = undefined
            this.minLabTime = undefined
            while (this.$laps.firstChild) {
                this.$laps.removeChild(this.$laps.lastChild)
            }
        }
    }

    // 돔에 시간을 업데이트 해주는 값
    handleUpdateTime(time) {
        this.$timer.innerText = time
    }

    toggleBtnStyle() {
        this.$startButton.classList.toggle('bg-green-600')
        this.$startButton.classList.toggle('bg-red-600')
    }

    handleKeyDown(e) {
        switch (e.code) {
            case 'KeyL':
                this.handleResetTime()
                break
            case 'KeyS':
                this.onClickStartBtn()
                break
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
