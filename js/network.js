//here is setup class for network
class NeuralNetworkVisualization {
    constructor(containerId, profileImageId) {
      this.container = document.getElementById(containerId);
      this.profileImage = document.getElementById(profileImageId);
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.neurons = [];
      this.connections = [];
      this.mouseX = 0;
      this.mouseY = 0;
      
      this.init();
    }
    
    init() {
      //for image
      const rect = this.profileImage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      this.scene = new THREE.Scene();
      
      //camera i setup for cursor
      this.camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000
      );
      this.camera.position.z = 200;
      
      //here is renderer
      this.renderer = new THREE.WebGLRenderer({ alpha: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0x000000, 0);
      this.container.appendChild(this.renderer.domElement);
      
      //neurons banaye
      this.createNeurons(75, rect.width * 1.8);
      
      //connections
      this.createConnections(80); 
      
      window.addEventListener('mousemove', this.onMouseMove.bind(this));
      window.addEventListener('resize', this.onWindowResize.bind(this));
      
      this.animate();
    }
    
    createNeurons(count, radius) {
      //multiple layer
      const layers = 3;
      const neuronsPerLayer = Math.floor(count / layers);
      
      //random size
      const geometries = [
        new THREE.SphereGeometry(2, 8, 8),
        new THREE.SphereGeometry(3, 8, 8),
        new THREE.SphereGeometry(4, 8, 8)
      ];
      
      const materials = [
        new THREE.MeshBasicMaterial({ color: 0xffcd42, transparent: true, opacity: 0.5 }),
        new THREE.MeshBasicMaterial({ color: 0xffcd42, transparent: true, opacity: 0.7 }),
        new THREE.MeshBasicMaterial({ color: 0xffcd42, transparent: true, opacity: 0.9 })
      ];
      
      for (let layer = 0; layer < layers; layer++) {
        const layerRadius = radius * (0.6 + layer * 0.2);
        
        for (let i = 0; i < neuronsPerLayer; i++) {
          const phi = Math.acos(-1 + (2 * i) / neuronsPerLayer);
          const theta = Math.sqrt(neuronsPerLayer * Math.PI) * phi;
          
          // Randomly select geometry and material for variety
          const geoIndex = Math.floor(Math.random() * geometries.length);
          const matIndex = Math.floor(Math.random() * materials.length);
          
          const neuron = new THREE.Mesh(geometries[geoIndex], materials[matIndex]);
          neuron.position.x = layerRadius * Math.sin(phi) * Math.cos(theta);
          neuron.position.y = layerRadius * Math.sin(phi) * Math.sin(theta);
          neuron.position.z = layerRadius * Math.cos(phi);
          
          //random movement
          neuron.userData = {
            velocity: new THREE.Vector3(
              Math.random() * 0.2 - 0.1,
              Math.random() * 0.2 - 0.1,
              Math.random() * 0.2 - 0.1
            ),
            originalPosition: neuron.position.clone(),
            layer: layer,
            pulsePhase: Math.random() * Math.PI * 2, 
            pulseSpeed: 0.05 + Math.random() * 0.1 
          };
          
          this.neurons.push(neuron);
          this.scene.add(neuron);
        }
      }
      
      //neuron inside layer
      for (let i = 0; i < count * 0.3; i++) {
        const geoIndex = Math.floor(Math.random() * geometries.length);
        const matIndex = Math.floor(Math.random() * materials.length);
        
        const neuron = new THREE.Mesh(geometries[geoIndex], materials[matIndex]);
        
        const r = radius * 0.5 * Math.random();
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        neuron.position.x = r * Math.sin(phi) * Math.cos(theta);
        neuron.position.y = r * Math.sin(phi) * Math.sin(theta);
        neuron.position.z = r * Math.cos(phi);
        
        neuron.userData = {
          velocity: new THREE.Vector3(
            Math.random() * 0.1 - 0.05,
            Math.random() * 0.1 - 0.05,
            Math.random() * 0.1 - 0.05
          ),
          originalPosition: neuron.position.clone(),
          layer: 3, // Inner layer
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.03 + Math.random() * 0.05
        };
        
        this.neurons.push(neuron);
        this.scene.add(neuron);
      }
    }
    
    createConnections(maxDistance) {
      //metraial for each connection
      const materials = [
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 }),
        new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 }),
        new THREE.LineBasicMaterial({ color: 0xffcd42, transparent: true, opacity: 0.3 })
      ];
      
      for (let i = 0; i < this.neurons.length; i++) {
        //connection limit
        let connectionsCount = 0;
        const maxConnectionsPerNeuron = 3 + Math.floor(Math.random() * 3); // 3-5 connections
        
        for (let j = i + 1; j < this.neurons.length; j++) {
          if (connectionsCount >= maxConnectionsPerNeuron) break;
          
          const distance = this.neurons[i].position.distanceTo(this.neurons[j].position);
          
          if (distance < maxDistance) {
            const materialIndex = Math.min(
              Math.floor(distance / (maxDistance / materials.length)),
              materials.length - 1
            );
            
            const geometry = new THREE.BufferGeometry().setFromPoints([
              this.neurons[i].position,
              this.neurons[j].position
            ]);
            
            const line = new THREE.Line(geometry, materials[materialIndex]);
            this.connections.push({
              line: line,
              neuron1: this.neurons[i],
              neuron2: this.neurons[j],
              // Add pulse effect data
              pulsePhase: Math.random() * Math.PI * 2,
              pulseSpeed: 0.02 + Math.random() * 0.03
            });
            
            this.scene.add(line);
            connectionsCount++;
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
      
      //on mouse posision
      this.scene.rotation.x += (this.mouseY * 0.05 - this.scene.rotation.x) * 0.05;
      this.scene.rotation.y += (this.mouseX * 0.05 - this.scene.rotation.y) * 0.05;
      
      const time = Date.now() * 0.001;
      
      for (const neuron of this.neurons) {
        //small random movement
        neuron.position.add(neuron.userData.velocity);
        
        const direction = neuron.userData.originalPosition.clone().sub(neuron.position);
        direction.multiplyScalar(0.01);
        neuron.position.add(direction);
        
        //reverse dir
        if (neuron.position.distanceTo(neuron.userData.originalPosition) > 10) {
          neuron.userData.velocity.multiplyScalar(-1);
        }
        
        const pulse = Math.sin(time * neuron.userData.pulseSpeed + neuron.userData.pulsePhase) * 0.2 + 1;
        neuron.scale.set(pulse, pulse, pulse);
        
        // Adjust opacity based on pulse for subtle effect
        if (neuron.material.opacity) {
          neuron.material.opacity = 0.5 + Math.sin(time * neuron.userData.pulseSpeed * 0.5) * 0.2;
        }
      }
      
      //update
      for (const connection of this.connections) {
        connection.line.geometry.setFromPoints([
          connection.neuron1.position,
          connection.neuron2.position
        ]);
        connection.line.geometry.attributes.position.needsUpdate = true;
        
        const pulseFactor = Math.sin(time * connection.pulseSpeed + connection.pulsePhase) * 0.2 + 0.5;
        connection.line.material.opacity = pulseFactor * 0.3; // Keep it subtle
      }
      
      this.renderer.render(this.scene, this.camera);
    }
  }
  
  //when DOM loaded
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.createElement('div');
    container.id = 'neural-network-container';
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-1';
    
    const profileImage = document.querySelector('.profile-image');
    profileImage.parentNode.insertBefore(container, profileImage);
    
    //id to image
    profileImage.id = 'profile-image';

    new NeuralNetworkVisualization('neural-network-container', 'profile-image');
    
    profileImage.style.animation = 'none';
  });
  