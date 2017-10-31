import * as THREE from 'three';
import Basic from 'WebSynth/Modules/Basic';
import {OrbitControls} from 'WebSynth/Three/OrbitControls';

export default class WebSynth {

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.modules = [];
        document.body.appendChild(this.renderer.domElement);
    }

    run() {
        this.addModule(new Basic());
        this.camera.position.z = 5;
        this.controls = new OrbitControls(this.camera,this.renderer.domElement);

        this.render(0);
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