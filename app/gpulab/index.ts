import axios from 'axios';

export class GPULabClient {
  private static instance: GPULabClient;
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.gpulab.ai';

  private constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GPULAB_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('GPU Lab API key not found in environment variables');
    }
  }

  public static getInstance(): GPULabClient {
    if (!GPULabClient.instance) {
      GPULabClient.instance = new GPULabClient();
    }
    return GPULabClient.instance;
  }

  private async makeRequest(endpoint: string, method: string, data?: any) {
    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        data,
      });
      return response.data;
    } catch (error: any) {
      console.error(`GPU Lab API Error: ${error.message}`);
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async deployModel(modelId: string) {
    try {
      // Get model configuration from the models array
      const modelConfig = models.find(m => m.id === modelId);
      if (!modelConfig) {
        throw new Error('Model configuration not found');
      }

      // Step 1: Create Model
      const modelData = {
        name: modelConfig.name,
        image_name: modelConfig.defaultConfig.containerImage,
        author_url: "https://neurolov.com",
        category_id: 1,
        min_vram: modelConfig.defaultConfig.minVram,
        isVisible: true,
        thumbnail_url: "https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        container_port: modelConfig.defaultConfig.exposedPorts.join(','),
        container_disk: modelConfig.defaultConfig.minDisk,
        volume_disk: modelConfig.defaultConfig.minDisk,
        volume_mount_path: "/workspace/data"
      };

      const modelResponse = await this.makeRequest('/model-upload', 'POST', modelData);
      const createdModelId = modelResponse.id;

      // Step 2: Create Network Volume
      const volumeData = {
        template_name: `${modelConfig.name.toLowerCase()}-volume`,
        volume_space: modelConfig.defaultConfig.minDisk,
        unit: 'GB'
      };

      const volumeResponse = await this.makeRequest('/nas-server', 'POST', volumeData);
      const volumeIdentifier = volumeResponse.volume_server_identifier;

      // Step 3: Create Container
      const containerData = {
        model_id: createdModelId,
        gpu_count: 1,
        gpu_type: "NVIDIA GeForce RTX 3090 Ti",
        volume_container_identifier: volumeIdentifier
      };

      const containerResponse = await this.makeRequest('/container/deploy', 'POST', containerData);

      return {
        model_id: createdModelId,
        volume_id: volumeIdentifier,
        container_address: containerResponse.container_address,
        ssh_url: `https://${containerResponse.container_address}.gpulab.co`,
        model_name: modelConfig.name
      };
    } catch (error: any) {
      console.error('Deployment failed:', error);
      throw new Error(`Deployment failed: ${error.message}`);
    }
  }

  async getContainerStatus(containerId: string) {
    return this.makeRequest('/containerstats', 'GET', null);
  }

  async listContainers() {
    return this.makeRequest('/containers', 'GET', null);
  }

  async deleteDeployment(modelId: string, volumeId: string, containerAddress: string) {
    await this.makeRequest('/container', 'DELETE', { address: containerAddress });
    await this.makeRequest(`/nas-server/${volumeId}`, 'DELETE');
    await this.makeRequest(`/models/${modelId}`, 'DELETE');
  }
}
