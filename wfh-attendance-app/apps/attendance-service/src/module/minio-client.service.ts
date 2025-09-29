import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { MINIO_CLIENT } from './minio-client.module';
import { v4 as uuidv4 } from 'uuid';
import { BufferedFile } from 'apps/attendance-service/src/interface/file.interface';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private readonly bucketName: string;

  constructor(
    @Inject(MINIO_CLIENT) private readonly minioClient: Client,
    private readonly configService: ConfigService,
  ) {
    this.bucketName = this.configService.get('MINIO_BUCKET_NAME')!;
  }

  // This hook ensures the bucket exists when the module is initialized
  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      this.logger.log(
        `Bucket "${this.bucketName}" does not exist. Creating...`,
      );
      await this.minioClient.makeBucket(this.bucketName);
      this.logger.log(`Bucket "${this.bucketName}" created successfully.`);
    } else {
      this.logger.log(`Bucket "${this.bucketName}" already exists.`);
    }
  }

  /**
   * Uploads a file to MinIO.
   * @param file The file to upload, including its buffer and metadata.
   * @returns The unique object name of the uploaded file.
   */
  async upload(file: BufferedFile): Promise<string> {
    const objectName = `${uuidv4()}-${file.originalname}`;
    const metaData = { 'Content-Type': file.mimetype };

    try {
      await this.minioClient.putObject(
        this.bucketName,
        objectName,
        file.buffer,
        file.size,
        metaData,
      );
      this.logger.log(
        `Successfully uploaded ${objectName} to bucket ${this.bucketName}`,
      );
      return objectName;
    } catch (err) {
      this.logger.error(`Error uploading file: ${err.message}`);
      throw new Error('Failed to upload file to MinIO');
    }
  }

  /**
   * Generates a temporary, presigned URL to access a file.
   * @param objectName The unique name of the object in the bucket.
   * @returns A URL string.
   */
  async getFileUrl(objectName: string): Promise<string> {
    try {
      // Generate a URL that expires in 1 hour (3600 seconds)
      const url = await this.minioClient.presignedGetObject(
        this.bucketName,
        objectName,
        3600,
      );
      return url;
    } catch (err) {
      this.logger.error(`Error getting file URL: ${err.message}`);
      throw new Error('Failed to retrieve file from MinIO');
    }
  }
}
