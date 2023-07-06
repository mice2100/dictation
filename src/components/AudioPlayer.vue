<!-- create a vue3 component to play a mp3 from a url.
add play/pause buttons to it
add pre/next buttons to it to jump to specific time
add text to show play speed, current time
add buttons to change speed: 0.8, 1.0, 1.25, 1.5
-->

<template>
    <v-container class="audio-player">
        <v-row>
            <span>{{ currentTime }} / {{ totalTime }}</span>
        </v-row>
        <v-row>
            <v-slider v-model="currentPos" :max="totalDuration" step="0.1"></v-slider>
        </v-row>
        <v-row>
            <v-btn variant="outlined" size="large" @click="play" v-if="!isPlaying">► Play</v-btn>
            <v-btn variant="outlined" size="large" @click="pause" v-else>❚❚ Pause</v-btn>
            <v-btn variant="outlined" @click="jumpToTime(prevTime)">Prev</v-btn>
            <v-btn variant="outlined" @click="jumpToTime(beginTime)">Rewind</v-btn>
            <v-btn variant="outlined" @click="jumpToTime(nextTime)">Next</v-btn>
            <v-switch v-model="showCaption" label="Show Caption"></v-switch>
        </v-row>
        <v-row>
            <v-menu location="end">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" dark v-bind="props">
                        {{ playSpeed }}
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item v-for="(item, index) in ['0.8', '1.0', '1.25', '1.5']" :key="index">
                        <v-list-item-title @click="changeSpeed(item)">{{ item }}</v-list-item-title>
                    </v-list-item>
                </v-list>

            </v-menu>
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
            audio: null,
            currentTime: '0:00',
            totalTime: '0:00',
            playSpeed: 1.0,
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
    watch: {
        currentPos() {
            this.changePos()
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
            this.audio.playbackRate = this.playSpeed
        },
        changePos() {
            this.audio.currentTime = this.currentPos
        }
    },
    mounted() {
        this.audio = new Audio("https://play.podtrac.com/npr-500005/edge1.pod.npr.org/anon.npr-mp3/npr/newscasts/2023/07/05/20230705_newscasts_long_130834.mp3?p=500005&e=nsv2-1688576400000-s1-long&d=300&t=podcast&size=4480621&awCollectionId=500005&awEpisodeId=nsv2-1688576400000-s1-long")
        this.audio.load()
        // fetch a json file and store in object
        fetch("01.json").then(response => response.json()).then(json => {
            let lastSentence = null
            for (let paragraph of json.paragraphs) {
                for (let sentence of paragraph.sentences) {
                    sentence.start = sentence.start.toFixed(4)
                    sentence.end = sentence.end.toFixed(4)
                    if (lastSentence) {
                        lastSentence.end = sentence.start
                    } else {
                        sentence.start = 0
                    }
                    lastSentence = sentence
                    this.sentences.push(sentence)
                }
            }
            // console.log(this.sentences)
        })
        //
        this.audio.addEventListener('loadedmetadata', () => {
            this.totalDuration = this.audio.duration
            const totalTime = Math.floor(this.audio.duration)
            const totalMinutes = Math.floor(totalTime / 60)
            const totalSeconds = 0
            this.totalTime = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`
        })
        this.audio.addEventListener('timeupdate', () => {
            // this.currentPos = this.audio.currentTime
            const currentTime = this.audio.currentTime
            for (let idx = 0; idx < this.sentences.length; idx++) {
                const sentence = this.sentences[idx]
                if (sentence.start <= currentTime && currentTime < sentence.end) {
                    if (idx > 0) {
                        this.prevTime = this.sentences[idx - 1].start
                    } else {
                        this.prevTime = 0
                    }
                    this.beginTime = sentence.start
                    if (idx < this.sentences.length - 1) {
                        const nextSentence = this.sentences[idx + 1]
                        this.nextTime = nextSentence.start
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
            const seconds = Math.round(currentTime) % 60
            this.currentTime = `${minutes}:${seconds.toString().padStart(2, '0')}`
        })
    }
}
</script>

<style>
.audio-player {
    /* styles */
}
</style>
