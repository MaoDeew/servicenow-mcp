# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-02-12

### Added
- Initial release of ServiceNow MCP server
- Core platform tools (schema, query, get record, users, groups)
- CMDB tools (CI lookup, search, relationships)
- ITOM tools (Discovery, MID servers, Event Management, Service Mapping, CMDB Health)
- ITSM tools (Change Request creation, Script Include execution)
- Service Portal tools (portal and page lookup)
- Knowledge Base tools (search and article retrieval)
- Natural language tools (search, update, script update)
- OAuth and Basic authentication support
- Comprehensive input validation and error handling
- Rate limiting with exponential backoff
- Sensitive data redaction in logs
- Test suite with vitest
- CI/CD pipeline with GitHub Actions
- Docker support

### Security
- Read-only by default
- Write operations require explicit enabling
- Script execution requires double opt-in
- Table access allowlist
- Sensitive data redaction
