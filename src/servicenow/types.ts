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
  maxRetries?: number;
  retryDelayMs?: number;
  requestTimeoutMs?: number;
}

export interface QueryRecordsParams {
  table: string;
  query?: string;
  fields?: string;
  limit?: number;
  orderBy?: string;
  offset?: number;
}

export interface QueryRecordsResponse {
  count: number;
  records: ServiceNowRecord[];
}

export interface ServiceNowRecord {
  [key: string]: string | number | boolean | ServiceNowReference | null | undefined;
}

export interface ServiceNowReference {
  value: string;
  display_value: string;
}

export interface OAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface ServiceNowApiResponse<T = any> {
  result: T;
}

export interface ServiceNowApiError {
  error: {
    message: string;
    detail?: string;
  };
  status: string;
}

// Core Platform Tool Params
export interface GetRecordParams {
  table: string;
  sys_id: string;
  fields?: string;
}

export interface GetUserParams {
  user_identifier: string;
}

export interface GetGroupParams {
  group_identifier: string;
}

// CMDB Tool Params
export interface SearchCmdbCiParams {
  query?: string;
  limit?: number;
}

export interface GetCmdbCiParams {
  ci_sys_id: string;
  fields?: string;
}

export interface ListRelationshipsParams {
  ci_sys_id: string;
}

// ITOM Tool Params
export interface ListDiscoverySchedulesParams {
  active_only?: boolean;
}

export interface ListMidServersParams {
  active_only?: boolean;
}

export interface ListActiveEventsParams {
  query?: string;
  limit?: number;
}

export interface ServiceMappingSummaryParams {
  service_sys_id: string;
}

// ITSM Tool Params
export interface CreateChangeRequestParams {
  short_description: string;
  assignment_group: string;
  description?: string;
  category?: string;
  priority?: string | number;
  risk?: string | number;
  impact?: string | number;
  urgency?: string | number;
}

// Natural Language Tool Params
export interface NaturalLanguageSearchParams {
  query: string;
  limit?: number;
}

export interface NaturalLanguageUpdateParams {
  instruction: string;
  table: string;
}
