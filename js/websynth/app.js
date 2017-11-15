import {OrbitControls} from 'WebSynth/Three/OrbitControls';
import AudioSynth from 'WebSynth/AudioEngine/AudioSynth'

export default class WebSynth {

    constructor() {

        const Synth = new AudioSynth();
        this.piano = Synth.createInstrument('piano');

        this.strangerThings = [
            {octave: 3, note: 'C', duration: 0.3},
            {octave: 3, note: 'E', duration: 0.3},
            {octave: 3, note: 'G', duration: 0.3},
            {octave: 3, note: 'B', duration: 0.3},
            {octave: 4, note: 'C', duration: 0.3},
            {octave: 3, note: 'B', duration: 0.3},
            {octave: 3, note: 'G', duration: 0.3},
            {octave: 3, note: 'E', duration: 0.3},
        ];
        this.index = 0;
        this.play();
    }

    play() {
        let {octave, note, duration} = this.strangerThings[this.index];
        this.index++;
        this.index = this.index % this.strangerThings.length;
        if (this.piano.play(note, octave, duration)) {
            window.setTimeout(this.play.bind(this), Math.ceil(duration * 1000));
        }
    }


    addModule(module) {
        this.modules.push(module.getModel());
        this.scene.add(this.modules[this.modules.length - 1]);
    }

    render(timer) {
        this.renderer.render(this.scene, this.camera);

        window.requestAnimationFrame((timer) => {
            this.render(timer);
        });
    }
}