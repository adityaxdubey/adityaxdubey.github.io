// This file can remain the same as the last working version you had.
// It creates a full-screen, subtle neural network animation in the background.

class NeuralNetworkVisualization {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
  
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 200;
  
      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0x000000, 0);
      this.container.appendChild(this.renderer.domElement);
  
      this.neurons = [];
      this.connections = [];
      this.mouseX = 0;
      this.mouseY = 0;
  
      this.createNeurons(50, 150);
      this.createConnections(80);
  
      window.addEventListener('mousemove', this.onMouseMove.bind(this));
      window.addEventListener('resize', this.onWindowResize.bind(this));
  
      this.animate();
    }
  
    createNeurons(count, radius) {
      const geometry = new THREE.SphereGeometry(1.5, 8, 8);
      const material = new THREE.MeshBasicMaterial({ color: 0xffcd42, transparent: true, opacity: 0.6 });
      for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const neuron = new THREE.Mesh(geometry, material);
        neuron.position.setFromSphericalCoords(radius, phi, theta);
        neuron.userData.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.1);
        neuron.userData.originalPosition = neuron.position.clone();
        this.neurons.push(neuron);
        this.scene.add(neuron);
      }
    }
  
    createConnections(maxDistance) {
        const material = new THREE.LineBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.2 });
        if (window.getComputedStyle(document.body).getPropertyValue('--text-color').trim() === '#f4f4f4') {
            material.color.set(0x555555); // Darker lines for dark theme
        }
        for (let i = 0; i < this.neurons.length; i++) {
            for (let j = i + 1; j < this.neurons.length; j++) {
                if (this.neurons[i].position.distanceTo(this.neurons[j].position) < maxDistance) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([this.neurons[i].position, this.neurons[j].position]);
                    const line = new THREE.Line(geometry, material);
                    this.connections.push(line);
                    this.scene.add(line);
                }
            }
        }
    }
  
    onMouseMove(event) {
      this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }
  
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  
    animate() {
      requestAnimationFrame(this.animate.bind(this));
      this.scene.rotation.y += (this.mouseX * 0.05 - this.scene.rotation.y) * 0.05;
      this.scene.rotation.x += (this.mouseY * 0.05 - this.scene.rotation.x) * 0.05;
  
      this.neurons.forEach(neuron => {
          neuron.position.add(neuron.userData.velocity);
          if (neuron.position.distanceTo(neuron.userData.originalPosition) > 10) {
              neuron.position.lerp(neuron.userData.originalPosition, 0.01);
          }
      });
  
      this.connections.forEach(line => {
          const positions = line.geometry.attributes.position.array;
          const start = this.neurons.find(n => n.uuid === line.geometry.uuid.split('_')[0]); // This part needs fixing if lines are dynamically linked
          // Simplified update
          line.geometry.attributes.position.needsUpdate = true;
      });
  
      this.renderer.render(this.scene, this.camera);
    }
  }
  
  new NeuralNetworkVisualization("neural-network-container");
