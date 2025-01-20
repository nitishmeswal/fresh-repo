import { gpulabService } from './gpulabService';

export interface DeploymentConfig {
  modelName: string;
  imageName: string;
  authorUrl: string;
  categoryId: number;
  minVram: number;
  containerPort: string;
  containerDisk: number;
  volumeDisk: number;
  volumeMountPath: string;
  gpuCount: number;
  gpuType: string;
}

export class DeploymentHandler {
  async deployModel(config: DeploymentConfig) {
    try {
      // Step 1: Create the model
      const modelResponse = await gpulabService.createModel({
        name: config.modelName,
        image_name: config.imageName,
        author_url: config.authorUrl,
        category_id: config.categoryId,
        min_vram: config.minVram,
        isVisible: true,
        container_port: config.containerPort,
        container_disk: config.containerDisk,
        volume_disk: config.volumeDisk,
        volume_mount_path: config.volumeMountPath,
      });

      const modelId = modelResponse.id;

      // Step 2: Create network volume
      const volumeResponse = await gpulabService.createNetworkVolume({
        template_name: `${config.modelName}-volume`,
        volume_space: config.volumeDisk,
        unit: 'GB',
      });

      const volumeIdentifier = volumeResponse.volume_server_identifier;

      // Step 3: Create container with GPU
      const containerResponse = await gpulabService.createContainer({
        model_id: modelId,
        gpu_count: config.gpuCount,
        gpu_type: config.gpuType,
        volume_container_identifier: volumeIdentifier,
      });

      // Return deployment details including SSH terminal URL
      return {
        modelId,
        volumeIdentifier,
        containerAddress: containerResponse.container_address,
        sshTerminalUrl: `https://${containerResponse.container_address}.gpulab.co`,
        status: 'deployed',
      };
    } catch (error) {
      console.error('Deployment failed:', error);
      throw new Error('Failed to deploy model: ' + (error as Error).message);
    }
  }

  async getDeploymentStatus(containerId: string) {
    try {
      const containerInfo = await gpulabService.getContainerInfo(containerId);
      return containerInfo;
    } catch (error) {
      console.error('Failed to get deployment status:', error);
      throw error;
    }
  }

  async cleanupDeployment(modelId: string, volumeId: string, containerAddress: string) {
    try {
      await gpulabService.deleteContainer(containerAddress);
      await gpulabService.deleteNetworkVolume(volumeId);
      await gpulabService.deleteModel(modelId);
      return { status: 'cleaned' };
    } catch (error) {
      console.error('Cleanup failed:', error);
      throw error;
    }
  }
}

export default DeploymentHandler;
