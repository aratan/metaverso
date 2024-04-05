//import { mensaje } from './mensaje.js'
import { sendMessage } from './sendMessage.js';

document.addEventListener('DOMContentLoaded', () => {
    // Variables de gravedad
    const gravity = 0.01; // Ajusta la fuerza de la gravedad según sea necesario
    let gravityActivated = true;
    
    // chat
    const sendMessageButton = document.querySelector('.btn-warning');

    sendMessageButton.addEventListener('click', () => {
        // Llama a la función sendMessage cuando se hace clic en el botón
        sendMessage();
    });

    // Crear la escena
    const scene = new THREE.Scene();

    // Crear la cámara
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Crear el cubo verde
    const cubeGeometry1 = new THREE.BoxGeometry(); // Tamaño por defecto
    const cubeMaterial1 = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Color verde
    const cube1 = new THREE.Mesh(cubeGeometry1, cubeMaterial1);
    cube1.position.x = -2; // Posición del primer cubo
    scene.add(cube1);

    // Video
    const video = document.createElement('video');
    video.src = './mov_bbb.mp4'; // Ruta del video
    video.loop = true;
    video.muted = false;
    const texture = new THREE.VideoTexture(video);
    video.play();
    const videoMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const videoFaceGeometry = new THREE.PlaneGeometry(5, 5);
    const videoFace = new THREE.Mesh(videoFaceGeometry, videoMaterial);
    scene.add(videoFace);

    // Crear el suelo con textura de hierba
    const grassTexture = new THREE.TextureLoader().load('grasslight-big.jpg');
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(10, 10); // Repetir la textura en el suelo
    const groundGeometry = new THREE.PlaneGeometry(50, 50); // Tamaño del suelo
    const groundMaterial = new THREE.MeshStandardMaterial({ map: grassTexture }); // Aplicar textura de hierba
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Rotar para que esté horizontal
    ground.position.y = -2; // Posicionar debajo del cubo
    scene.add(ground);

    // Crear la cúpula para el cielo
    const domeGeometry = new THREE.SphereGeometry(500, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2); // Radio y segmentos
    const domeMaterial = new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }); // Color azul cielo y lado trasero
    const dome = new THREE.Mesh(domeGeometry, domeMaterial);
    scene.add(dome);


    // Crear una luz direccional para iluminar la escena
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 0); // Dirección de la luz
    scene.add(directionalLight);

    // Crear una luz ambiental para iluminar la escena de forma global
    const ambientLight = new THREE.AmbientLight(0x404040); // Color gris oscuro
    scene.add(ambientLight);

    // Crear el renderizador
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Variables para el movimiento de la cámara
    let moveForward = false;
    let moveBackward = false;
    let moveLeft = false;
    let moveRight = false;
    const cameraSpeed = 0.1;

    // evento video parar
    // Agregar un indicador para controlar si el video está reproduciéndose o no
    let isVideoPlaying = true; // Inicialmente, el video comienza reproduciéndose

    // Manejar evento de teclado para pausar y reanudar el video
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'p':
                if (isVideoPlaying) {
                    video.pause(); // Pausar el video si está reproduciéndose
                    isVideoPlaying = false;
                } else {
                    video.play(); // Reanudar la reproducción si el video está pausado
                    isVideoPlaying = true;
                }
                break;
        }
    });



    // Manejar eventos de teclado para mover la cámara
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'w':
                moveForward = true;
                break;
            case 'a':
                moveLeft = true;
                break;
            case 's':
                moveBackward = true;
                break;
            case 'd':
                moveRight = true;
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'w':
                moveForward = false;
                break;
            case 'a':
                moveLeft = false;
                break;
            case 's':
                moveBackward = false;
                break;
            case 'd':
                moveRight = false;
                break;
        }
    });

    // Agregar un event listener para el clic del ratón
    document.addEventListener('click', onMouseClick);

    function onMouseClick(event) {
        // Calculamos las coordenadas normalizadas del clic del ratón
        const mouse = {
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1
        };

        // Creamos un rayo desde la posición de la cámara hacia la dirección del clic del ratón
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        // Obtenemos una lista de objetos que intersectan con el rayo
        const intersects = raycaster.intersectObjects(scene.children, true);

        // Verificamos si el cubo verde está entre los objetos intersectados
        const cubeIntersected = intersects.find(obj => obj.object === cube1);

        // Si el cubo verde fue clicado, llamamos a la función mensaje con el parámetro "adios"
        if (cubeIntersected) {
            alert("Evento caja verde");
        }
    }





    // Variables para la rotación de la cámara
    let rotateLeft = false;
    let rotateRight = false;

    // Manejar eventos de teclado para rotar la cámara
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'q':
                rotateLeft = true; // Rotar la cámara hacia la izquierda
                break;
            case 'e':
                rotateRight = true; // Rotar la cámara hacia la derecha
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'q':
                rotateLeft = false;
                break;
            case 'e':
                rotateRight = false;
                break;
        }
    });

    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);

        // Rotar el cubo verde
        cube1.rotation.x += 0.01;
        cube1.rotation.y += 0.01;

        // Rotar el cubo azul
        //cube2.rotation.x -= 0.01;
        //cube2.rotation.y -= 0.01;

        // Aplicar gravedad si está activada y el cubo verde no está en el suelo
        if (gravityActivated && cube1.position.y > ground.position.y) {
            cube1.position.y -= gravity; // Ajusta el objeto verde hacia abajo en el eje Y
            console.log('Aplicando gravedad a cubo verde');
        } else {
            console.log("Evento gravedad");
        }

        // Actualizar posición de la cámara basada en las teclas presionadas
        // Actualizar posición de la cámara basada en las teclas presionadas
        if (moveForward) {
            camera.position.x -= cameraSpeed * Math.sin(camera.rotation.y);
            camera.position.z -= cameraSpeed * Math.cos(camera.rotation.y);
        }
        if (moveBackward) {
            camera.position.x += cameraSpeed * Math.sin(camera.rotation.y);
            camera.position.z += cameraSpeed * Math.cos(camera.rotation.y);
        }
        if (moveLeft) {
            camera.position.x -= cameraSpeed * Math.cos(camera.rotation.y);
            camera.position.z += cameraSpeed * Math.sin(camera.rotation.y);
        }
        if (moveRight) {
            camera.position.x += cameraSpeed * Math.cos(camera.rotation.y);
            camera.position.z -= cameraSpeed * Math.sin(camera.rotation.y);
        }


        // Rotar la cámara
        if (rotateLeft) {
            camera.rotation.y += 0.01; // Rotar la cámara hacia la izquierda
        }
        if (rotateRight) {
            camera.rotation.y -= 0.01; // Rotar la cámara hacia la derecha
        }

        renderer.render(scene, camera);
    };


    animate();  // Variables de gravedad    
});
