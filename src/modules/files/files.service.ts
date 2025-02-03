import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectAclCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FilesService {
  private readonly s3: S3;
  private readonly bucketName: string;
  private readonly bucketBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('STORAGE_BUCKET_NAME');
    this.bucketBaseUrl = this.configService.get<string>('STORAGE_BUCKET_URL');

    this.s3 = new S3({
      region: this.configService.get<string>('DO_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('DO_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('DO_SECRET_ACCESS_KEY'),
      },
      endpoint: `https://${this.configService.get<string>('DO_ENDPOINT')}`,
      forcePathStyle: true,
    });
  }

  async generateSignedUrl(
    contentType: string,
    fileName: string,
  ): Promise<string> {
    const key = `${fileName}`;
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    return signedUrl;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `${Date.now()}-${file.originalname}`;
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read' as const,
    };

    await this.s3.send(new PutObjectCommand(params));
    return `${this.bucketBaseUrl}/${key}`;
  }

  async downloadFile(
    fileLink: string,
  ): Promise<{ filename: string; data: Buffer }> {
    const key = fileLink.split(`${this.bucketBaseUrl}/`).pop();
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response = await this.s3.send(command);
    const buffer = await response.Body.transformToByteArray();
    return {
      filename: fileLink,
      data: Buffer.from(buffer),
    };
  }

  async deleteFileByName(fileLink: string) {
    const key = fileLink.split(`${this.bucketBaseUrl}/`).pop();
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3.send(command);
  }

  async setPublicAccess(fileName: string) {
    const key = `${fileName}`;
    const params = {
      Bucket: this.bucketName,
      Key: key,
      ACL: 'public-read' as const,
    };

    try {
      await this.s3.send(new PutObjectAclCommand(params));
    } catch (error) {
      throw new Error(`Failed to make file ${fileName} public: ${error}`);
    }
  }
}
