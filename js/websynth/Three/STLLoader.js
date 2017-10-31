import * as THREE from 'three';


class STLLoader {
    constructor(manager) {

        this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
        this.constructor = STLLoader;

    }

    load(url, onLoad, onProgress, onError) {

        let scope = this;

        let loader = new THREE.FileLoader(scope.manager);
        loader.setResponseType('arraybuffer');
        loader.load(url, function (text) {

            onLoad(scope.parse(text));

        }, onProgress, onError);

    }

    parse(data) {

        function isBinary(data) {

            let expect, face_size, n_faces, reader;
            reader = new DataView(data);
            face_size = ( 32 / 8 * 3 ) + ( ( 32 / 8 * 3 ) * 3 ) + ( 16 / 8 );
            n_faces = reader.getUint32(80, true);
            expect = 80 + ( 32 / 8 ) + ( n_faces * face_size );

            if (expect === reader.byteLength) {

                return true;

            }

            // An ASCII STL data must begin with 'solid ' as the first six bytes.
            // However, ASCII STLs lacking the SPACE after the 'd' are known to be
            // plentiful.  So, check the first 5 bytes for 'solid'.

            // US-ASCII ordinal values for 's', 'o', 'l', 'i', 'd'

            let solid = [115, 111, 108, 105, 100];

            for (let i = 0; i < 5; i++) {

                // If solid[ i ] does not match the i-th byte, then it is not an
                // ASCII STL; hence, it is binary and return true.

                if (solid[i] !== reader.getUint8(i, false)) return true;

            }

            // First 5 bytes read "solid"; declare it to be an ASCII STL

            return false;

        }

        function parseBinary(data) {

            let reader = new DataView(data);
            let faces = reader.getUint32(80, true);

            let r, g, b, hasColors = false, colors;
            let defaultR, defaultG, defaultB, alpha;

            // process STL header
            // check for default color in header ("COLOR=rgba" sequence).

            for (let index = 0; index < 80 - 10; index++) {

                if (( reader.getUint32(index, false) === 0x434F4C4F /*COLO*/ ) &&
                    ( reader.getUint8(index + 4) === 0x52 /*'R'*/ ) &&
                    ( reader.getUint8(index + 5) === 0x3D /*'='*/ )) {

                    hasColors = true;
                    colors = [];

                    defaultR = reader.getUint8(index + 6) / 255;
                    defaultG = reader.getUint8(index + 7) / 255;
                    defaultB = reader.getUint8(index + 8) / 255;
                    alpha = reader.getUint8(index + 9) / 255;

                }

            }

            let dataOffset = 84;
            let faceLength = 12 * 4 + 2;

            let geometry = new THREE.BufferGeometry();

            let vertices = [];
            let normals = [];

            for (let face = 0; face < faces; face++) {

                let start = dataOffset + face * faceLength;
                let normalX = reader.getFloat32(start, true);
                let normalY = reader.getFloat32(start + 4, true);
                let normalZ = reader.getFloat32(start + 8, true);

                if (hasColors) {

                    let packedColor = reader.getUint16(start + 48, true);

                    if (( packedColor & 0x8000 ) === 0) {

                        // facet has its own unique color

                        r = ( packedColor & 0x1F ) / 31;
                        g = ( ( packedColor >> 5 ) & 0x1F ) / 31;
                        b = ( ( packedColor >> 10 ) & 0x1F ) / 31;

                    } else {

                        r = defaultR;
                        g = defaultG;
                        b = defaultB;

                    }

                }

                for (let i = 1; i <= 3; i++) {

                    let vertexstart = start + i * 12;

                    vertices.push(reader.getFloat32(vertexstart, true));
                    vertices.push(reader.getFloat32(vertexstart + 4, true));
                    vertices.push(reader.getFloat32(vertexstart + 8, true));

                    normals.push(normalX, normalY, normalZ);

                    if (hasColors) {

                        colors.push(r, g, b);

                    }

                }

            }

            geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
            geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));

            if (hasColors) {

                geometry.addAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
                geometry.hasColors = true;
                geometry.alpha = alpha;

            }

            return geometry;

        }

        function parseASCII(data) {

            let geometry = new THREE.BufferGeometry();
            let patternFace = /facet([\s\S]*?)endfacet/g;
            let faceCounter = 0;

            let patternFloat = /[\s]+([+-]?(?:\d+.\d+|\d+.|\d+|.\d+)(?:[eE][+-]?\d+)?)/.source;
            let patternVertex = new RegExp('vertex' + patternFloat + patternFloat + patternFloat, 'g');
            let patternNormal = new RegExp('normal' + patternFloat + patternFloat + patternFloat, 'g');

            let vertices = [];
            let normals = [];

            let normal = new THREE.Vector3();

            let result;

            while (( result = patternFace.exec(data) ) !== null) {

                let vertexCountPerFace = 0;
                let normalCountPerFace = 0;

                let text = result[0];

                while (( result = patternNormal.exec(text) ) !== null) {

                    normal.x = parseFloat(result[1]);
                    normal.y = parseFloat(result[2]);
                    normal.z = parseFloat(result[3]);
                    normalCountPerFace++;

                }

                while (( result = patternVertex.exec(text) ) !== null) {

                    vertices.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
                    normals.push(normal.x, normal.y, normal.z);
                    vertexCountPerFace++;

                }

                // every face have to own ONE valid normal

                if (normalCountPerFace !== 1) {

                    console.error('STLLoader: Something isn\'t right with the normal of face number ' + faceCounter);

                }

                // each face have to own THREE valid vertices

                if (vertexCountPerFace !== 3) {

                    console.error('STLLoader: Something isn\'t right with the vertices of face number ' + faceCounter);

                }

                faceCounter++;

            }

            geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));

            return geometry;

        }

        function ensureString(buffer) {

            if (typeof buffer !== 'string') {

                let array_buffer = new Uint8Array(buffer);

                if (window.TextDecoder !== undefined) {

                    return new TextDecoder().decode(array_buffer);

                }

                let str = '';

                for (let i = 0, il = buffer.byteLength; i < il; i++) {

                    str += String.fromCharCode(array_buffer[i]); // implicitly assumes little-endian

                }

                return str;

            } else {

                return buffer;

            }

        }

        function ensureBinary(buffer) {

            if (typeof buffer === 'string') {

                let array_buffer = new Uint8Array(buffer.length);
                for (let i = 0; i < buffer.length; i++) {

                    array_buffer[i] = buffer.charCodeAt(i) & 0xff; // implicitly assumes little-endian

                }
                return array_buffer.buffer || array_buffer;

            } else {

                return buffer;

            }

        }

        // start

        let binData = ensureBinary(data);

        return isBinary(binData) ? parseBinary(binData) : parseASCII(ensureString(data));

    }
}


export {STLLoader as STLLoader};