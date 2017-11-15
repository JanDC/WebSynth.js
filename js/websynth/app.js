import {OrbitControls} from 'WebSynth/Three/OrbitControls';
import AudioSynth from 'WebSynth/AudioEngine/AudioSynth'

export default class WebSynth {

    constructor() {

        const Synth = new AudioSynth();
        this.piano = Synth.createInstrument('piano');
        this.play('F#', 3, 0.5);
    }

    play(note, octave, duration) {
        octave++;
        octave = octave % 3;
        if (this.piano.play(note, octave, duration)) {
            console.log(`playing note ${note}-${octave} for ${duration} seconds`);
            window.setTimeout(this.play.bind(this, note, octave, duration), 1000);
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