import axios from 'axios';

const GPULAB_API_KEY = process.env.NEXT_PUBLIC_GPULAB_API_KEY;
const BASE_URL = 'https://api.gpulab.ai';

const gpulabApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'api-key': GPULAB_API_KEY,
    'Content-Type': 'application/json',
  },
});

export interface CreateModelRequest {
  name: string;
  image_name: string;
  author_url: string;
  category_id: number;
  min_vram: number;
  isVisible: boolean;
  container_port: string;
  container_disk: number;
  volume_disk: number;
  volume_mount_path: string;
  docker_command?: string;
  env_vars?: Record<string, string>;
  username?: string;
  password?: string;
  readme?: string;
}

export interface CreateNetworkVolumeRequest {
  template_name: string;
  volume_space: number;
  unit?: string;
  region_type?: string;
}

export interface CreateContainerRequest {
  model_id: number;
  gpu_count: number;
  gpu_type: string;
  volume_container_identifier?: string;
  existing_container_address?: string;
}

export const gpulabService = {
  // Model Operations
  async createModel(data: CreateModelRequest) {
    try {
      const response = await gpulabApi.post('/model-upload', data);
      return response.data;
    } catch (error) {
      console.error('Error creating model:', error);
      throw error;
    }
  },

  async deleteModel(identifier: string) {
    try {
      const response = await gpulabApi.delete(`/models/${identifier}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting model:', error);
      throw error;
    }
  },

  async listModels() {
    try {
      const response = await gpulabApi.get('/models');
      return response.data;
    } catch (error) {
      console.error('Error listing models:', error);
      throw error;
    }
  },

  // Network Volume Operations
  async createNetworkVolume(data: CreateNetworkVolumeRequest) {
    try {
      const response = await gpulabApi.post('/nas-server', data);
      return response.data;
    } catch (error) {
      console.error('Error creating network volume:', error);
      throw error;
    }
  },

  async deleteNetworkVolume(identifier: string) {
    try {
      const response = await gpulabApi.delete(`/nas-server/${identifier}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting network volume:', error);
      throw error;
    }
  },

  async listNetworkVolumes() {
    try {
      const response = await gpulabApi.get('/nas-servers');
      return response.data;
    } catch (error) {
      console.error('Error listing network volumes:', error);
      throw error;
    }
  },

  // Container Operations
  async createContainer(data: CreateContainerRequest) {
    try {
      const response = await gpulabApi.post('/container/deploy', data);
      return response.data;
    } catch (error) {
      console.error('Error creating container:', error);
      throw error;
    }
  },

  async deleteContainer(address: string) {
    try {
      const response = await gpulabApi.delete('/container', {
        data: { address },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting container:', error);
      throw error;
    }
  },

  async getContainerInfo(containerId: string) {
    try {
      const response = await gpulabApi.get('/containerstats', {
        headers: {
          'container_id': containerId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error getting container info:', error);
      throw error;
    }
  },

  async listContainers() {
    try {
      const response = await gpulabApi.get('/containers');
      return response.data;
    } catch (error) {
      console.error('Error listing containers:', error);
      throw error;
    }
  },
};

export default gpulabService;
