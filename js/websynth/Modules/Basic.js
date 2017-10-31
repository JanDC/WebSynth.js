import * as THREE from 'three';
import {STLLoader} from 'WebSynth/Three/STLLoader';

export default class Basic {
    constructor() {
        const knobLoader = new STLLoader();
        knobLoader.load('assets/knob.stl', (geometry) => {
            this.knob = geometry;
        });
    }

    getConfiguration() {

    }

    getModel() {
        const box = new THREE.BoxBufferGeometry(3, 2, 1);
        const texture = new THREE.TextureLoader().load('assets/laminate.jpg');
        const material = new THREE.MeshBasicMaterial({map: texture});
        return new THREE.Mesh(box, material);
    }
}