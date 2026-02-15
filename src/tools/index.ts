import type { ServiceNowClient } from '../servicenow/client.js';
import type {
  QueryRecordsParams,
  GetRecordParams,
  GetUserParams,
  GetGroupParams,
  SearchCmdbCiParams,
  GetCmdbCiParams,
  ListRelationshipsParams,
  ListDiscoverySchedulesParams,
  ListMidServersParams,
  ListActiveEventsParams,
  ServiceMappingSummaryParams,
  CreateChangeRequestParams,
  NaturalLanguageSearchParams,
  NaturalLanguageUpdateParams,
} from '../servicenow/types.js';
import { ServiceNowError } from '../utils/errors.js';

export function getTools() {
  return [
    // Core Platform Tools
    {
      name: 'query_records',
      description: 'Query ServiceNow records with filtering, field selection, pagination, and sorting',
      inputSchema: {
        type: 'object',
        properties: {
          table: {
            type: 'string',
            description: 'Table name (e.g., "incident", "change_request", "problem")',
          },
          query: {
            type: 'string',
            description: 'Encoded query string using ServiceNow syntax (e.g., "active=true^priority=1"). Use ^ for AND, ^OR for OR, and dot-walking for related fields (e.g., "assignment_group.name=Database")',
          },
          fields: {
            type: 'string',
            description: 'Comma-separated list of fields to return (e.g., "number,short_description,state,assigned_to"). If omitted, all fields are returned.',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of records to return (default: 10, max: 1000)',
          },
          orderBy: {
            type: 'string',
            description: 'Field to sort by. Prefix with "-" for descending order (e.g., "-sys_updated_on" for newest first)',
          },
        },
        required: ['table'],
      },
    },
    {
      name: 'get_table_schema',
      description: 'Get the structure and field information for a ServiceNow table',
      inputSchema: {
        type: 'object',
        properties: {
          table: {
            type: 'string',
            description: 'Table name to get schema for (e.g., "incident", "change_request")',
          },
        },
        required: ['table'],
      },
    },
    {
      name: 'get_record',
      description: 'Retrieve complete details of a specific record by sys_id',
      inputSchema: {
        type: 'object',
        properties: {
          table: {
            type: 'string',
            description: 'Table name (e.g., "incident")',
          },
          sys_id: {
            type: 'string',
            description: '32-character system ID of the record',
          },
          fields: {
            type: 'string',
            description: 'Optional comma-separated list of fields to return',
          },
        },
        required: ['table', 'sys_id'],
      },
    },
    {
      name: 'get_user',
      description: 'Look up user details by email or username',
      inputSchema: {
        type: 'object',
        properties: {
          user_identifier: {
            type: 'string',
            description: 'Email address or username to search for',
          },
        },
        required: ['user_identifier'],
      },
    },
    {
      name: 'get_group',
      description: 'Find assignment group details by name or sys_id',
      inputSchema: {
        type: 'object',
        properties: {
          group_identifier: {
            type: 'string',
            description: 'Group name or sys_id to search for',
          },
        },
        required: ['group_identifier'],
      },
    },

    // CMDB Tools
    {
      name: 'search_cmdb_ci',
      description: 'Search for configuration items (CIs) in the CMDB using encoded query syntax',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Encoded query string (e.g., "sys_class_name=cmdb_ci_server^operational_status=1")',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of CIs to return (default: 10, max: 100)',
          },
        },
        required: [],
      },
    },
    {
      name: 'get_cmdb_ci',
      description: 'Get complete information about a specific configuration item',
      inputSchema: {
        type: 'object',
        properties: {
          ci_sys_id: {
            type: 'string',
            description: 'System ID of the configuration item',
          },
          fields: {
            type: 'string',
            description: 'Optional comma-separated list of fields to return',
          },
        },
        required: ['ci_sys_id'],
      },
    },
    {
      name: 'list_relationships',
      description: 'Show parent and child relationships for a configuration item',
      inputSchema: {
        type: 'object',
        properties: {
          ci_sys_id: {
            type: 'string',
            description: 'System ID of the configuration item',
          },
        },
        required: ['ci_sys_id'],
      },
    },

    // ITOM Tools
    {
      name: 'list_discovery_schedules',
      description: 'Check which discovery schedules are active and when they last ran',
      inputSchema: {
        type: 'object',
        properties: {
          active_only: {
            type: 'boolean',
            description: 'Filter to only active schedules (default: false)',
          },
        },
        required: [],
      },
    },
    {
      name: 'list_mid_servers',
      description: 'Verify MID servers are up and healthy',
      inputSchema: {
        type: 'object',
        properties: {
          active_only: {
            type: 'boolean',
            description: 'Filter to only servers with status "Up" (default: false)',
          },
        },
        required: [],
      },
    },
    {
      name: 'list_active_events',
      description: 'Monitor critical infrastructure events from monitoring tools',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Encoded query to filter events (e.g., "severity=1^node.nameLIKEPROD")',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of events to return (default: 10)',
          },
        },
        required: [],
      },
    },
    {
      name: 'cmdb_health_dashboard',
      description: 'Get data quality metrics for CMDB (completeness of server and network CI data)',
      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
    {
      name: 'service_mapping_summary',
      description: 'Understand service dependencies for change impact analysis',
      inputSchema: {
        type: 'object',
        properties: {
          service_sys_id: {
            type: 'string',
            description: 'System ID of the business service',
          },
        },
        required: ['service_sys_id'],
      },
    },

    // ITSM Tools
    {
      name: 'create_change_request',
      description: 'Create a new change request record (requires WRITE_ENABLED=true)',
      inputSchema: {
        type: 'object',
        properties: {
          short_description: {
            type: 'string',
            description: 'Brief summary of the change',
          },
          assignment_group: {
            type: 'string',
            description: 'Group name or sys_id to assign the change to',
          },
          description: {
            type: 'string',
            description: 'Detailed description of the change',
          },
          category: {
            type: 'string',
            description: 'Change category',
          },
          priority: {
            type: 'number',
            description: 'Priority (1=Critical, 2=High, 3=Moderate, 4=Low)',
          },
          risk: {
            type: 'number',
            description: 'Risk level (1=High, 2=Medium, 3=Low)',
          },
          impact: {
            type: 'number',
            description: 'Impact (1=High, 2=Medium, 3=Low)',
          },
        },
        required: ['short_description', 'assignment_group'],
      },
    },

    // Natural Language Tools
    {
      name: 'natural_language_search',
      description: 'Search ServiceNow using plain English queries (experimental)',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Plain English search query (e.g., "find incidents about database issues")',
          },
          limit: {
            type: 'number',
            description: 'Maximum number of results (default: 10)',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'natural_language_update',
      description: 'Update a record using conversational language (experimental, requires WRITE_ENABLED=true)',
      inputSchema: {
        type: 'object',
        properties: {
          instruction: {
            type: 'string',
            description: 'Natural language instruction (e.g., "Update incident INC0010001 to say I\'m working on it")',
          },
          table: {
            type: 'string',
            description: 'Table name',
          },
        },
        required: ['instruction', 'table'],
      },
    },
  ];
}

export async function executeTool(
  client: ServiceNowClient,
  name: string,
  args: Record<string, any>
): Promise<any> {
  // Check write permissions for write operations
  const writeEnabled = process.env.WRITE_ENABLED === 'true';

  switch (name) {
    case 'query_records':
      return await executeQueryRecords(client, args as QueryRecordsParams);

    case 'get_table_schema':
      return await executeGetTableSchema(client, args.table);

    case 'get_record':
      return await executeGetRecord(client, args as GetRecordParams);

    case 'get_user':
      return await executeGetUser(client, args as GetUserParams);

    case 'get_group':
      return await executeGetGroup(client, args as GetGroupParams);

    case 'search_cmdb_ci':
      return await executeSearchCmdbCi(client, args as SearchCmdbCiParams);

    case 'get_cmdb_ci':
      return await executeGetCmdbCi(client, args as GetCmdbCiParams);

    case 'list_relationships':
      return await executeListRelationships(client, args as ListRelationshipsParams);

    case 'list_discovery_schedules':
      return await executeListDiscoverySchedules(client, args as ListDiscoverySchedulesParams);

    case 'list_mid_servers':
      return await executeListMidServers(client, args as ListMidServersParams);

    case 'list_active_events':
      return await executeListActiveEvents(client, args as ListActiveEventsParams);

    case 'cmdb_health_dashboard':
      return await executeCmdbHealthDashboard(client);

    case 'service_mapping_summary':
      return await executeServiceMappingSummary(client, args as ServiceMappingSummaryParams);

    case 'create_change_request':
      if (!writeEnabled) {
        throw new ServiceNowError(
          'Write operations are disabled. Set WRITE_ENABLED=true to create change requests.',
          'WRITE_NOT_ENABLED'
        );
      }
      return await executeCreateChangeRequest(client, args as CreateChangeRequestParams);

    case 'natural_language_search':
      return await executeNaturalLanguageSearch(client, args as NaturalLanguageSearchParams);

    case 'natural_language_update':
      if (!writeEnabled) {
        throw new ServiceNowError(
          'Write operations are disabled. Set WRITE_ENABLED=true to update records.',
          'WRITE_NOT_ENABLED'
        );
      }
      return await executeNaturalLanguageUpdate(client, args as NaturalLanguageUpdateParams);

    default:
      throw new ServiceNowError(`Unknown tool: ${name}`, 'UNKNOWN_TOOL');
  }
}

// Tool execution functions

async function executeQueryRecords(
  client: ServiceNowClient,
  params: QueryRecordsParams
): Promise<any> {
  if (!params.table) {
    throw new ServiceNowError('Table name is required', 'INVALID_REQUEST');
  }

  if (params.limit !== undefined && (params.limit < 1 || params.limit > 1000)) {
    throw new ServiceNowError('Limit must be between 1 and 1000', 'INVALID_REQUEST');
  }

  const response = await client.queryRecords(params);

  return {
    count: response.count,
    records: response.records,
    summary: `Found ${response.count} record(s) in table "${params.table}"${params.query ? ` matching query: ${params.query}` : ''}`,
  };
}

async function executeGetTableSchema(client: ServiceNowClient, table: string): Promise<any> {
  if (!table) {
    throw new ServiceNowError('Table name is required', 'INVALID_REQUEST');
  }

  return await client.getTableSchema(table);
}

async function executeGetRecord(client: ServiceNowClient, params: GetRecordParams): Promise<any> {
  if (!params.table || !params.sys_id) {
    throw new ServiceNowError('Table name and sys_id are required', 'INVALID_REQUEST');
  }

  return await client.getRecord(params.table, params.sys_id, params.fields);
}

async function executeGetUser(client: ServiceNowClient, params: GetUserParams): Promise<any> {
  if (!params.user_identifier) {
    throw new ServiceNowError('User identifier is required', 'INVALID_REQUEST');
  }

  return await client.getUser(params.user_identifier);
}

async function executeGetGroup(client: ServiceNowClient, params: GetGroupParams): Promise<any> {
  if (!params.group_identifier) {
    throw new ServiceNowError('Group identifier is required', 'INVALID_REQUEST');
  }

  return await client.getGroup(params.group_identifier);
}

async function executeSearchCmdbCi(client: ServiceNowClient, params: SearchCmdbCiParams): Promise<any> {
  return await client.searchCmdbCi(params.query, params.limit);
}

async function executeGetCmdbCi(client: ServiceNowClient, params: GetCmdbCiParams): Promise<any> {
  if (!params.ci_sys_id) {
    throw new ServiceNowError('CI sys_id is required', 'INVALID_REQUEST');
  }

  return await client.getCmdbCi(params.ci_sys_id, params.fields);
}

async function executeListRelationships(client: ServiceNowClient, params: ListRelationshipsParams): Promise<any> {
  if (!params.ci_sys_id) {
    throw new ServiceNowError('CI sys_id is required', 'INVALID_REQUEST');
  }

  return await client.listRelationships(params.ci_sys_id);
}

async function executeListDiscoverySchedules(client: ServiceNowClient, params: ListDiscoverySchedulesParams): Promise<any> {
  return await client.listDiscoverySchedules(params.active_only);
}

async function executeListMidServers(client: ServiceNowClient, params: ListMidServersParams): Promise<any> {
  return await client.listMidServers(params.active_only);
}

async function executeListActiveEvents(client: ServiceNowClient, params: ListActiveEventsParams): Promise<any> {
  return await client.listActiveEvents(params.query, params.limit);
}

async function executeCmdbHealthDashboard(client: ServiceNowClient): Promise<any> {
  return await client.cmdbHealthDashboard();
}

async function executeServiceMappingSummary(client: ServiceNowClient, params: ServiceMappingSummaryParams): Promise<any> {
  if (!params.service_sys_id) {
    throw new ServiceNowError('Service sys_id is required', 'INVALID_REQUEST');
  }

  return await client.serviceMappingSummary(params.service_sys_id);
}

async function executeCreateChangeRequest(client: ServiceNowClient, params: CreateChangeRequestParams): Promise<any> {
  if (!params.short_description || !params.assignment_group) {
    throw new ServiceNowError('short_description and assignment_group are required', 'INVALID_REQUEST');
  }

  const result = await client.createChangeRequest(params);

  return {
    ...result,
    summary: `Created change request ${result.number || result.sys_id}`,
  };
}

async function executeNaturalLanguageSearch(client: ServiceNowClient, params: NaturalLanguageSearchParams): Promise<any> {
  if (!params.query) {
    throw new ServiceNowError('Query is required', 'INVALID_REQUEST');
  }

  return await client.naturalLanguageSearch(params.query, params.limit);
}

async function executeNaturalLanguageUpdate(client: ServiceNowClient, params: NaturalLanguageUpdateParams): Promise<any> {
  if (!params.instruction || !params.table) {
    throw new ServiceNowError('Instruction and table are required', 'INVALID_REQUEST');
  }

  return await client.naturalLanguageUpdate(params.instruction, params.table);
}
