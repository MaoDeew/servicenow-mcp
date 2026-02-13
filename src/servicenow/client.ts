export interface ServiceNowConfig {
  instanceUrl: string;
  authMethod: 'oauth' | 'basic';
  oauth?: { clientId?: string; clientSecret?: string; username?: string; password?: string; };
  basic?: { username?: string; password?: string; };
  maxRetries?: number;
  retryDelayMs?: number;
  requestTimeoutMs?: number;
}

export class ServiceNowClient {
  constructor(config: ServiceNowConfig) {
    console.log('ServiceNow client initialized');
  }
}
