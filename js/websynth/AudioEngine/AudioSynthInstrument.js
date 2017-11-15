class AudioSynthInstrument {
    constructor(_parent, name, _soundID) {
        this._parent = _parent;
        this._soundID = _soundID;
        this.name = name;


    }

    play(note, octave, duration) {
        return this._parent.play(this._soundID, note, octave, duration);
    }

    generate(note, octave, duration) {
        return this._parent.generate(this._soundID, note, octave, duration);
    }
}


export default AudioSynthInstrument;