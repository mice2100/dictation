<!-- create a vue3 component to play a mp3 from a url.
add play/pause buttons to it
add pre/next buttons to it to jump to specific time
add text to show play speed, current time
add buttons to change speed: 0.8, 1.0, 1.25, 1.5
-->

<template>
    <v-container class="audio-player pa-2">
        <v-row align="center">
            <v-btn variant="outlined" @click="next(-1)" :disabled="index <= 0">
                <v-icon icon="mdi-skip-previous"></v-icon></v-btn>
            <v-card-text>{{ caption }}</v-card-text>
            <v-btn variant="outlined" @click="next(1)" :disabled="index >= nprnews.length - 1">
                <v-icon icon="mdi-skip-next"></v-icon></v-btn>
        </v-row>
        <v-row>
            <span>{{ currentTime }} / {{ totalTime }}</span>
        </v-row>
        <v-row>
            <v-slider v-model="currentPos" @update:model-value="changePos()" :max="totalDuration"></v-slider>
        </v-row>
        <v-row align="center">
            <v-switch v-model="showCaption" hide-details inset color="primary" label="Caption"></v-switch>
            <v-switch v-model="repeat" hide-details inset color="primary" label="Repeat"></v-switch>

            <v-menu location="end">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" dark v-bind="props">
                        {{ playSpeed }}
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item v-for="(item, index) in ['0.8x', '1.0x', '1.25x', '1.5x']" :key="index">
                        <v-list-item-title @click="changeSpeed(item)">{{ item }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-row>
        <v-row align="center">
            <v-btn variant="outlined" color="primary" width="160" @click="play" v-if="!isPlaying">
                <v-icon icon="mdi-play"></v-icon></v-btn>
            <v-btn variant="outlined" width="160" @click="pause" v-else>
                <v-icon icon="mdi-pause"></v-icon></v-btn>
            <v-btn variant="outlined" width="90" @click="jumpToTime(beginTime)">
                <v-icon icon="mdi-replay"></v-icon></v-btn>
            <v-btn variant="outlined" @click="jumpToTime(prevTime)">
                <v-icon icon="mdi-rewind"></v-icon></v-btn>
            <v-btn variant="outlined" @click="jumpToTime(nextTime)">
                <v-icon icon="mdi-fast-forward"></v-icon></v-btn>
        </v-row>
        <v-row>
            <v-card variant="tonal" v-if=showCaption>
                <v-card-text>{{ currentSentence }}</v-card-text>
            </v-card>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            nprnews: [],
            index: -1,
            repeat: true,
            caption: "",
            audio: null,
            currentTime: '0:00',
            totalTime: '0:00',
            playSpeed: "1.0x",
            prevTime: 0,
            beginTime: 0,
            nextTime: 0,
            sentences: [],
            showCaption: false,
            isPlaying: false,
            totalDuration: 0,
            currentPos: 0,
            currentSentence: ""
        }
    },
    methods: {
        play() {
            this.audio.play()
            this.isPlaying = true
        },
        pause() {
            this.audio.pause()
            this.isPlaying = false
        },
        jumpToTime(time) {
            this.audio.currentTime = time
        },
        changeSpeed(speed) {
            this.playSpeed = speed
            this.audio.playbackRate = parseFloat(this.playSpeed)
        },
        changePos() {
            this.audio.currentTime = this.currentPos
        },
        next(step = 1) {
            if (!this.nprnews || this.nprnews.length == 0) return
            this.index += step
            if (this.index >= this.nprnews.length) {
                this.index = 0
            }
            let news = this.nprnews[this.index]

            fetch(import.meta.env.VITE_API_PATH + `/get/${news.uid}`).then(response => response.json()).then(json => {
                this.sentences = []
                let lastEndTime = 0
                for (let paragraph of json.transcript) {
                    for (let sentence of paragraph.sentences) {
                        sentence.startTime = lastEndTime
                        lastEndTime = sentence.endTime
                        this.sentences.push(sentence)
                    }
                }
                console.log(this.sentences)
            })
            this.audio.src = news.audioUrl
            this.audio.load()
            this.caption = news.title
            // this.audio.play()
        },
    },
    mounted() {
        fetch(import.meta.env.VITE_API_PATH + '/list').then(response => response.json()).then(json => {
            this.nprnews = json
            this.next()
        })
        this.audio = new Audio()
        //
        this.audio.addEventListener('loadedmetadata', () => {
            this.totalDuration = Math.round(this.audio.duration)
            const totalTime = this.audio.duration
            const totalMinutes = Math.floor(totalTime / 60)
            const totalSeconds = Math.round(totalTime % 60)
            this.totalTime = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`
        })
        this.audio.addEventListener('timeupdate', () => {
            const currentTime = this.audio.currentTime
            for (let idx = 0; idx < this.sentences.length; idx++) {
                const sentence = this.sentences[idx]
                if (sentence.start <= currentTime && currentTime < sentence.end) {
                    if (idx > 0) {
                        this.prevTime = this.sentences[idx - 1].start - 0.2
                    } else {
                        this.prevTime = 0
                    }
                    this.beginTime = sentence.start - 0.2
                    if (idx < this.sentences.length - 1) {
                        const nextSentence = this.sentences[idx + 1]
                        this.nextTime = nextSentence.start - 0.2
                    } else {
                        this.nextTime = this.audio.duration
                    }
                    this.currentSentence = sentence.text
                    break
                } else if (currentTime < sentence.start) {
                    break
                }
            }
            const minutes = Math.floor(currentTime / 60)
            const seconds = Math.round(currentTime % 60)
            this.currentTime = `${minutes}:${seconds.toString().padStart(2, '0')}`
            this.currentPos = Math.round(currentTime)
        })
        this.audio.addEventListener('ended', () => {
            if (this.repeat) {
                this.audio.play()
            }
        })
    }
}
</script>

<style>
.v-main {
    margin: 10px;
}

.v-row {
    margin: 10px 10px 0 0;
}

.v-btn {
    margin: 0 5px 0 0;
}
</style>
