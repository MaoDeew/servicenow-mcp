export function getTools() {
  return [
    {
      name: 'query_records',
      description: 'Query ServiceNow records',
      inputSchema: { type: 'object', properties: { table: { type: 'string' } }, required: ['table'] }
    }
  ];
}

export async function executeTool(_client: any, _name: string, _args: any) {
  return { status: 'Tool execution placeholder' };
}
