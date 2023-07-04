<!-- create a vue3 component to play a mp3 from a url.
add play/pause buttons to it
add pre/next buttons to it to jump to specific time
add text to show play speed, current time
add buttons to change speed: 0.8, 1.0, 1.25, 1.5
-->

<template>
    <v-container class="audio-player">
        <v-row>
            <span>Speed: {{ playSpeed }}x</span>
            <span>{{ currentTime }} / {{ totalTime }}</span>
        </v-row>
        <v-row>
            <v-btn @click="play">► Play</v-btn>
            <v-btn @click="pause">❚❚ Pause</v-btn>
            <v-btn @click="jumpToTime(prevTime)">Previous</v-btn>
            <v-btn @click="jumpToTime(nextTime)">Next</v-btn>
            <v-btn @click="changeSpeed(0.8)">0.8x</v-btn>
            <v-btn @click="changeSpeed(1.0)">1.0x</v-btn>
            <v-btn @click="changeSpeed(1.25)">1.25x</v-btn>
            <v-btn @click="changeSpeed(1.5)">1.5x</v-btn>
        </v-row>
        <v-row>
            <v-card>
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
            nextTime: 0,
            sentences: [],
            currentSentence: ""
        }
    },
    methods: {
        play() {
            this.audio.play()
        },
        pause() {
            this.audio.pause()
        },
        jumpToTime(time) {
            this.audio.currentTime = time
        },
        changeSpeed(speed) {
            this.audio.playbackRate = speed
            this.playSpeed = speed
        }
    },
    mounted() {
        this.audio = new Audio("https://play.podtrac.com/npr-500005/edge1.pod.npr.org/anon.npr-mp3/npr/newscasts/2023/06/30/20230630_newscasts_long_180834.mp3")
        this.audio.load()
        // fetch a json file and store in object
        fetch("01.json").then(response => response.json()).then(json => {
            for (let paragraph of json.paragraphs) {
                for (let sentence of paragraph.sentences) {
                    this.sentences.push(sentence)
                }
            }
            console.log(this.sentences)
        })
        //
        this.audio.addEventListener('loadedmetadata', () => {
            const totalTime = Math.floor(this.audio.duration)
            const totalMinutes = Math.floor(totalTime / 60)
            const totalSeconds = 60
            this.totalTime = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`
        })
        this.audio.addEventListener('timeupdate', () => {
            const currentTime = Math.floor(this.audio.currentTime)
            var time_start = 0
            var time_end = 0
            for (let sentence of this.sentences) {
                if (sentence.start <= currentTime && currentTime <= sentence.end) {
                    this.currentSentence = sentence.text
                    time_start = sentence.start
                    time_end = sentence.end
                    break
                }
            }
            const minutes = Math.floor(currentTime / 60)
            const seconds = currentTime % 60
            this.currentTime = `${minutes}:${seconds.toString().padStart(2, '0')}`

            // Calculate previous and next time based on current time
            this.prevTime = time_start
            this.nextTime = time_end
        })
    }
}
</script>

<style>
.audio-player {
    /* styles */
}
</style>
