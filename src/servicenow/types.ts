export interface ServiceNowConfig {
  instanceUrl: string;
  authMethod: 'oauth' | 'basic';
  oauth?: {
    clientId?: string;
    clientSecret?: string;
    username?: string;
    password?: string;
  };
  basic?: {
    username?: string;
    password?: string;
  };
}
