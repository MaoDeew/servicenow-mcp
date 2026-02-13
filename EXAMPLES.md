# ServiceNow MCP - Usage Examples

This document provides real-world examples of using the ServiceNow MCP server with expected inputs and outputs.

## Table of Contents
- [Quick Reference](#quick-reference)
- [Setup](#setup)
- [Core Platform Examples](#core-platform-examples)
- [CMDB Examples](#cmdb-examples)
- [ITOM Examples](#itom-examples)
- [ITSM Examples](#itsm-examples)
- [Natural Language Examples](#natural-language-examples)
- [Advanced Workflows](#advanced-workflows)

---

## Quick Reference

### Tool Catalog

| Tool Name | Category | Purpose | Write Op? | Key Parameters |
|-----------|----------|---------|-----------|----------------|
| get_table_schema | Core | Understand table structure | No | tableName |
| query_records | Core | Find records with filters | No | table, query, fields, limit |
| get_record | Core | Retrieve single record | No | table, sys_id |
| get_user | Core | Look up user details | No | user_identifier |
| get_group | Core | Find group information | No | group_identifier |
| search_cmdb_ci | CMDB | Search configuration items | No | query, limit |
| get_cmdb_ci | CMDB | Get CI details | No | ci_sys_id |
| list_relationships | CMDB | Show CI dependencies | No | ci_sys_id |
| list_discovery_schedules | ITOM | Check discovery status | No | active_only |
| list_mid_servers | ITOM | Verify MID server health | No | active_only |
| list_active_events | ITOM | Monitor infrastructure events | No | query, limit |
| cmdb_health_dashboard | ITOM | Get data quality metrics | No | none |
| service_mapping_summary | ITOM | Service dependencies | No | service_sys_id |
| create_change_request | ITSM | Create change record | **Yes** | short_description, assignment_group |
| natural_language_search | NL | Query using plain English | No | query, limit |
| natural_language_update | NL | Update conversationally | **Yes** | instruction, table |

---

## Setup

### MCP Client Configuration

Add to your MCP client (e.g., Claude Desktop config):

```json
{
  "mcpServers": {
    "servicenow": {
      "command": "node",
      "args": ["/path/to/servicenow-mcp/dist/server.js"],
      "env": {
        "SERVICENOW_INSTANCE_URL": "https://dev12345.service-now.com",
        "SERVICENOW_AUTH_METHOD": "oauth",
        "SERVICENOW_CLIENT_ID": "your_client_id",
        "SERVICENOW_CLIENT_SECRET": "your_client_secret",
        "SERVICENOW_USERNAME": "admin",
        "SERVICENOW_PASSWORD": "password",
        "WRITE_ENABLED": "false",
        "LOG_LEVEL": "info"
      }
    }
  }
}
```

---

## Core Platform Examples

### Example 1: Get Table Schema

**Use Case:** Understanding the structure of the incident table before querying.

**Tool Call:**
```json
{
  "tool": "get_table_schema",
  "arguments": {
    "tableName": "incident"
  }
}
```

**Expected Output:**
```json
{
  "table": {
    "name": "incident",
    "label": "Incident",
    "super_class": "task"
  },
  "columns": [
    {
      "element": "number",
      "column_label": "Number",
      "internal_type": "string",
      "mandatory": true,
      "max_length": 40
    },
    {
      "element": "short_description",
      "column_label": "Short description",
      "internal_type": "string",
      "mandatory": false,
      "max_length": 160
    },
    {
      "element": "priority",
      "column_label": "Priority",
      "internal_type": "integer",
      "mandatory": false
    },
    {
      "element": "assigned_to",
      "column_label": "Assigned to",
      "internal_type": "reference",
      "mandatory": false,
      "reference": "sys_user"
    },
    {
      "element": "state",
      "column_label": "State",
      "internal_type": "integer",
      "mandatory": false
    }
  ]
}
```

**What You Learn:**
- Field names and types
- Required vs optional fields
- Reference fields point to other tables
- Maximum lengths for strings

---

### Example 2: Query High-Priority Incidents

**Use Case:** Find all active P1 incidents assigned to the Database team.

**Tool Call:**
```json
{
  "tool": "query_records",
  "arguments": {
    "table": "incident",
    "query": "active=true^priority=1^assignment_group.name=Database",
    "fields": "number,short_description,assigned_to,state,opened_at,sys_updated_on",
    "limit": 10,
    "orderBy": "-sys_updated_on"
  }
}
```

**Expected Output:**
```json
{
  "count": 3,
  "records": [
    {
      "number": "INC0010001",
      "short_description": "SAP system down in production",
      "assigned_to": {
        "value": "5137153cc611227c000bbd1bd8cd2005",
        "display_value": "Fred Luddy"
      },
      "state": "2",
      "opened_at": "2024-02-10 14:30:22",
      "sys_updated_on": "2024-02-12 09:15:33"
    },
    {
      "number": "INC0010045",
      "short_description": "Database cluster failover issue",
      "assigned_to": {
        "value": "5137153cc611227c000bbd1bd8cd2006",
        "display_value": "David Miller"
      },
      "state": "2",
      "opened_at": "2024-02-11 08:20:15",
      "sys_updated_on": "2024-02-12 08:42:10"
    },
    {
      "number": "INC0010078",
      "short_description": "Oracle connection timeout errors",
      "assigned_to": {
        "value": "5137153cc611227c000bbd1bd8cd2007",
        "display_value": "Sarah Chen"
      },
      "state": "1",
      "opened_at": "2024-02-12 07:05:44",
      "sys_updated_on": "2024-02-12 07:05:44"
    }
  ]
}
```

**Insights:**
- Query uses encoded query syntax: `field=value^field2=value2` (^ means AND)
- Can query related tables with dot-walking: `assignment_group.name`
- State "2" = Work in Progress, "1" = New
- Results ordered by most recently updated

---

### Example 3: Get Specific Record

**Use Case:** Retrieve complete details of a specific incident.

**Tool Call:**
```json
{
  "tool": "get_record",
  "arguments": {
    "table": "incident",
    "sys_id": "9d385017c611228701d22104cc95c371",
    "fields": "number,short_description,description,priority,state,assigned_to,opened_by,opened_at,work_notes"
  }
}
```

**Expected Output:**
```json
{
  "number": "INC0010001",
  "short_description": "SAP system down in production",
  "description": "Users unable to access SAP production environment. Getting connection timeout errors. Critical business impact - payroll processing blocked.",
  "priority": "1",
  "state": "2",
  "assigned_to": {
    "value": "5137153cc611227c000bbd1bd8cd2005",
    "display_value": "Fred Luddy"
  },
  "opened_by": {
    "value": "681ccaf9c0a8016400b98a06818d57c7",
    "display_value": "Joe Employee"
  },
  "opened_at": "2024-02-10 14:30:22",
  "work_notes": "2024-02-12 09:15:33 - Fred Luddy\nInvestigating database connection pool. Found max connections reached.\n\n2024-02-11 16:20:15 - Fred Luddy\nWorking with DBA team to increase connection limits."
}
```

---

### Example 4: Get User Information

**Use Case:** Look up user details by email or username.

**Tool Call:**
```json
{
  "tool": "get_user",
  "arguments": {
    "user_identifier": "fred.luddy@example.com"
  }
}
```

**Expected Output:**
```json
{
  "sys_id": "5137153cc611227c000bbd1bd8cd2005",
  "user_name": "fred.luddy",
  "name": "Fred Luddy",
  "email": "fred.luddy@example.com",
  "title": "Senior System Administrator",
  "department": {
    "value": "221ba7ae0a0a0b99000e5fd90a05f5f5",
    "display_value": "IT Operations"
  },
  "active": true,
  "roles": "admin,itil,itil_admin"
}
```

---

### Example 5: Get Group Information

**Use Case:** Find assignment group details.

**Tool Call:**
```json
{
  "tool": "get_group",
  "arguments": {
    "group_identifier": "Database"
  }
}
```

**Expected Output:**
```json
{
  "sys_id": "8a5055c9c61122780043563ef53438e3",
  "name": "Database",
  "description": "Database administration and support team",
  "active": true,
  "manager": {
    "value": "5137153cc611227c000bbd1bd8cd2005",
    "display_value": "Fred Luddy"
  },
  "type": "assigned_group"
}
```

---

## CMDB Examples

### Example 6: Search Configuration Items

**Use Case:** Find all production servers in a specific datacenter.

**Tool Call:**
```json
{
  "tool": "search_cmdb_ci",
  "arguments": {
    "query": "sys_class_name=cmdb_ci_server^operational_status=1^locationLIKEDC-EAST",
    "limit": 20
  }
}
```

**Expected Output:**
```json
{
  "count": 5,
  "records": [
    {
      "sys_id": "00a96c0d3790200044e0bfc8bcbe5db4",
      "name": "SAP-PROD-DB01",
      "sys_class_name": "cmdb_ci_server",
      "operational_status": "1",
      "support_group": {
        "value": "8a5055c9c61122780043563ef53438e3",
        "display_value": "Database"
      },
      "location": {
        "value": "108752c5c611227501b682158cc93cde",
        "display_value": "DC-EAST-01"
      }
    },
    {
      "sys_id": "01a96c0d3790200044e0bfc8bcbe5db5",
      "name": "SAP-PROD-APP01",
      "sys_class_name": "cmdb_ci_server",
      "operational_status": "1",
      "support_group": {
        "value": "d625dccec0a8016700a222a0f7900d06",
        "display_value": "Application Support"
      },
      "location": {
        "value": "108752c5c611227501b682158cc93cde",
        "display_value": "DC-EAST-01"
      }
    }
  ]
}
```

---

### Example 7: Get CI Details

**Use Case:** Get complete information about a specific server.

**Tool Call:**
```json
{
  "tool": "get_cmdb_ci",
  "arguments": {
    "ci_sys_id": "00a96c0d3790200044e0bfc8bcbe5db4"
  }
}
```

**Expected Output:**
```json
{
  "sys_id": "00a96c0d3790200044e0bfc8bcbe5db4",
  "name": "SAP-PROD-DB01",
  "sys_class_name": "cmdb_ci_server",
  "operational_status": "1",
  "support_group": {
    "value": "8a5055c9c61122780043563ef53438e3",
    "display_value": "Database"
  },
  "managed_by": {
    "value": "5137153cc611227c000bbd1bd8cd2005",
    "display_value": "Fred Luddy"
  },
  "owned_by": {
    "value": "681ccaf9c0a8016400b98a06818d57c7",
    "display_value": "Joe Employee"
  },
  "location": {
    "value": "108752c5c611227501b682158cc93cde",
    "display_value": "DC-EAST-01"
  },
  "install_status": "1",
  "asset_tag": "SRV-12345"
}
```

---

### Example 8: List CI Relationships

**Use Case:** Understand dependencies - what connects to this database server?

**Tool Call:**
```json
{
  "tool": "list_relationships",
  "arguments": {
    "ci_sys_id": "00a96c0d3790200044e0bfc8bcbe5db4"
  }
}
```

**Expected Output:**
```json
{
  "count": 8,
  "relationships": [
    {
      "sys_id": "a6c45e93c611227400d421948a7ba7f1",
      "parent": {
        "value": "01a96c0d3790200044e0bfc8bcbe5db5",
        "display_value": "SAP-PROD-APP01"
      },
      "child": {
        "value": "00a96c0d3790200044e0bfc8bcbe5db4",
        "display_value": "SAP-PROD-DB01"
      },
      "type": {
        "value": "d93304fb0a0a0b78006a2912f2f352d1",
        "display_value": "Depends on::Used by"
      },
      "port": "1521"
    },
    {
      "sys_id": "b7d56fa4c711338500e421059b8ca8g2",
      "parent": {
        "value": "00a96c0d3790200044e0bfc8bcbe5db4",
        "display_value": "SAP-PROD-DB01"
      },
      "child": {
        "value": "02b97d1e4801311044f0cfc9bcce5e95",
        "display_value": "STORAGE-SAN-001"
      },
      "type": {
        "value": "e04418290a0a0b5e0116894de1d632f3",
        "display_value": "Uses::Used by"
      }
    }
  ]
}
```

**What This Shows:**
- SAP-PROD-APP01 depends on SAP-PROD-DB01 (application → database)
- SAP-PROD-DB01 uses STORAGE-SAN-001 (database → storage)
- Port 1521 indicates Oracle database connection

---

## ITOM Examples

### Example 9: List Discovery Schedules

**Use Case:** Check which discovery schedules are active and when they last ran.

**Tool Call:**
```json
{
  "tool": "list_discovery_schedules",
  "arguments": {
    "active_only": true
  }
}
```

**Expected Output:**
```json
{
  "count": 4,
  "schedules": [
    {
      "sys_id": "0c441abbc611227501b5db8a3b9a2f2f",
      "name": "Production Network Discovery",
      "discovers": "10.0.0.0/8",
      "type": "Network Discovery",
      "active": true,
      "next_run": "2024-02-13 02:00:00",
      "run_as": {
        "value": "5137153cc611227c000bbd1bd8cd2005",
        "display_value": "Fred Luddy"
      }
    },
    {
      "sys_id": "1d552bccd722338601c6de9b4c0b3e3e",
      "name": "Windows Server Discovery",
      "discovers": "Windows Servers",
      "type": "Windows",
      "active": true,
      "next_run": "2024-02-13 03:00:00",
      "run_as": {
        "value": "5137153cc611227c000bbd1bd8cd2005",
        "display_value": "Fred Luddy"
      }
    },
    {
      "sys_id": "2e663cdde833449712d7fa8c5d1c4f4f",
      "name": "Linux Server Discovery",
      "discovers": "Linux Servers",
      "type": "Unix",
      "active": true,
      "next_run": "2024-02-13 04:00:00",
      "run_as": {
        "value": "5137153cc611227c000bbd1bd8cd2005",
        "display_value": "Fred Luddy"
      }
    }
  ]
}
```

---

### Example 10: Check MID Server Status

**Use Case:** Verify all MID servers are up and healthy.

**Tool Call:**
```json
{
  "tool": "list_mid_servers",
  "arguments": {
    "active_only": true
  }
}
```

**Expected Output:**
```json
{
  "count": 3,
  "mid_servers": [
    {
      "sys_id": "0f774efef944449812c8eb9c6d2e5g5g",
      "name": "MID-DC-EAST-01",
      "status": "Up",
      "host_name": "mid-server-east.company.com",
      "ip_address": "10.10.1.50",
      "last_refreshed": "2024-02-12 19:58:15",
      "validated": "2024-02-12 00:05:22"
    },
    {
      "sys_id": "1g885fgfg055550923d9fc0d7e3f6h6h",
      "name": "MID-DC-WEST-01",
      "status": "Up",
      "host_name": "mid-server-west.company.com",
      "ip_address": "10.20.1.50",
      "last_refreshed": "2024-02-12 19:57:48",
      "validated": "2024-02-12 00:06:15"
    },
    {
      "sys_id": "2h996ghgh166661034e0gd1e8f4g7i7i",
      "name": "MID-CLOUD-01",
      "status": "Up",
      "host_name": "mid-server-cloud.company.com",
      "ip_address": "172.16.1.100",
      "last_refreshed": "2024-02-12 19:59:02",
      "validated": "2024-02-12 00:04:55"
    }
  ]
}
```

**Health Check:** All MID servers showing "Up" status and refreshed within last minute = healthy!

---

### Example 11: List Active Events

**Use Case:** Monitor critical infrastructure events.

**Tool Call:**
```json
{
  "tool": "list_active_events",
  "arguments": {
    "query": "severity=1^node.nameLIKEPROD",
    "limit": 10
  }
}
```

**Expected Output:**
```json
{
  "count": 2,
  "events": [
    {
      "sys_id": "3i007hih277772145f1he2f9g5h8j8j",
      "number": "EVT0010234",
      "source": "Nagios",
      "node": {
        "value": "00a96c0d3790200044e0bfc8bcbe5db4",
        "display_value": "SAP-PROD-DB01"
      },
      "severity": "1",
      "state": "Ready",
      "time_of_event": "2024-02-12 19:45:30",
      "message_key": "CPU_CRITICAL",
      "description": "CPU utilization above 95% for 10 minutes"
    },
    {
      "sys_id": "4j118iji388883256g2if3g0h6i9k9k",
      "number": "EVT0010235",
      "source": "SCOM",
      "node": {
        "value": "01a96c0d3790200044e0bfc8bcbe5db5",
        "display_value": "SAP-PROD-APP01"
      },
      "severity": "1",
      "state": "Ready",
      "time_of_event": "2024-02-12 19:50:12",
      "message_key": "DISK_CRITICAL",
      "description": "Disk space on C: drive at 98% capacity"
    }
  ]
}
```

---

### Example 12: CMDB Health Dashboard

**Use Case:** Get completeness metrics for CMDB data quality.

**Tool Call:**
```json
{
  "tool": "cmdb_health_dashboard",
  "arguments": {}
}
```

**Expected Output:**
```json
{
  "server_metrics": {
    "total": 245,
    "with_ip": 238,
    "with_os": 240,
    "with_serial": 195,
    "ip_completeness": "97.14",
    "os_completeness": "97.96"
  },
  "network_metrics": {
    "total": 1520,
    "with_ip": 1485,
    "with_mac": 1512,
    "ip_completeness": "97.70",
    "mac_completeness": "99.47"
  },
  "note": "For comprehensive CMDB health metrics, use the CMDB Health Dashboard UI or CMDB Health APIs if available"
}
```

**Analysis:**
- 97% server IP completeness = Good
- Only 79.6% have serial numbers = Needs improvement
- 99.5% network adapters have MAC addresses = Excellent

---

### Example 13: Service Mapping Summary

**Use Case:** Understand service dependencies for change impact analysis.

**Tool Call:**
```json
{
  "tool": "service_mapping_summary",
  "arguments": {
    "service_sys_id": "5c4a3g2b1d5e4f6789h0i1j2k3l4m5n6"
  }
}
```

**Expected Output:**
```json
{
  "service": {
    "sys_id": "5c4a3g2b1d5e4f6789h0i1j2k3l4m5n6",
    "name": "SAP ERP Production",
    "operational_status": "1",
    "owned_by": {
      "value": "681ccaf9c0a8016400b98a06818d57c7",
      "display_value": "Joe Employee"
    },
    "managed_by": {
      "value": "5137153cc611227c000bbd1bd8cd2005",
      "display_value": "Fred Luddy"
    },
    "business_criticality": "1"
  },
  "related_cis_count": 47,
  "related_cis": [
    {
      "sys_id": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      "ci_id": {
        "value": "00a96c0d3790200044e0bfc8bcbe5db4",
        "display_value": "SAP-PROD-DB01"
      },
      "service_id": {
        "value": "5c4a3g2b1d5e4f6789h0i1j2k3l4m5n6",
        "display_value": "SAP ERP Production"
      }
    }
  ]
}
```

**Insight:** SAP ERP service depends on 47 CIs - careful change planning required!

---

## ITSM Examples

### Example 14: Create Change Request (Write Operation)

**Use Case:** Automate change request creation for planned maintenance.

**Prerequisites:** 
- `WRITE_ENABLED=true` in environment
- Proper permissions in ServiceNow

**Tool Call:**
```json
{
  "tool": "create_change_request",
  "arguments": {
    "short_description": "Upgrade SAP database to latest patch level",
    "description": "Apply SAP database patches to resolve known performance issues. Requires 2-hour maintenance window.",
    "assignment_group": "8a5055c9c61122780043563ef53438e3",
    "category": "Software",
    "priority": "3",
    "risk": "3",
    "impact": "2",
    "urgency": "3"
  }
}
```

**Expected Output:**
```json
{
  "sys_id": "9e4b5d6c7f8a9b0c1d2e3f4a5b6c7d8e",
  "number": "CHG0030152",
  "short_description": "Upgrade SAP database to latest patch level",
  "state": "1",
  "assigned_to": null,
  "assignment_group": {
    "value": "8a5055c9c61122780043563ef53438e3",
    "display_value": "Database"
  },
  "priority": "3",
  "risk": "3",
  "impact": "2",
  "urgency": "3",
  "opened_at": "2024-02-12 20:15:44",
  "opened_by": {
    "value": "5137153cc611227c000bbd1bd8cd2005",
    "display_value": "Fred Luddy"
  }
}
```

**Success:** Change request CHG0030152 created and assigned to Database group!

---

## Natural Language Examples

### Example 15: Natural Language Search

**Use Case:** Query ServiceNow using plain English instead of encoded queries.

**Tool Call:**
```json
{
  "tool": "natural_language_search",
  "arguments": {
    "query": "find all incidents about SAP that are assigned to the Database team",
    "limit": 5
  }
}
```

**Expected Output:**
```json
{
  "query": "find all incidents about SAP that are assigned to the Database team",
  "table": "incident",
  "count": 3,
  "records": [
    {
      "sys_id": "9d385017c611228701d22104cc95c371",
      "number": "INC0010001",
      "short_description": "SAP system down in production",
      "description": "Users unable to access SAP production environment...",
      "state": "2",
      "assigned_to": {
        "value": "5137153cc611227c000bbd1bd8cd2005",
        "display_value": "Fred Luddy"
      }
    },
    {
      "sys_id": "0f496128c722339012d8fa9c5e2e4f5g",
      "number": "INC0010078",
      "short_description": "SAP interface errors",
      "description": "SAP to Salesforce integration failing...",
      "state": "1"
    }
  ],
  "note": "Natural language search is simplified. For advanced NLP, consider ServiceNow Virtual Agent or external NLP integration."
}
```

---

### Example 16: Natural Language Update

**Use Case:** Update a record using conversational language.

**Prerequisites:** `WRITE_ENABLED=true`

**Tool Call:**
```json
{
  "tool": "natural_language_update",
  "arguments": {
    "instruction": "Update incident INC0010001 saying I'm working on it and will have an update in 30 minutes",
    "table": "incident"
  }
}
```

**Expected Output:**
```json
{
  "instruction": "Update incident INC0010001 saying I'm working on it and will have an update in 30 minutes",
  "table": "incident",
  "sys_id": "9d385017c611228701d22104cc95c371",
  "updated_record": {
    "sys_id": "9d385017c611228701d22104cc95c371",
    "number": "INC0010001",
    "state": "2",
    "work_notes": "Update via natural language: I'm working on it and will have an update in 30 minutes",
    "sys_updated_on": "2024-02-12 20:25:18"
  },
  "note": "Natural language update is simplified. Always verify changes."
}
```

---

## Advanced Workflows

### Workflow 1: Incident Investigation

**Scenario:** Investigate a production incident end-to-end.

```javascript
// 1. Get the incident details
const incident = await mcp.callTool('get_record', {
  table: 'incident',
  sys_id: 'INC_SYS_ID',
  fields: 'number,short_description,cmdb_ci,assigned_to'
});

// 2. Get the affected CI
const ci = await mcp.callTool('get_cmdb_ci', {
  ci_sys_id: incident.cmdb_ci.value
});

// 3. Check CI relationships (what else might be affected?)
const relationships = await mcp.callTool('list_relationships', {
  ci_sys_id: ci.sys_id
});

// 4. Check for active events on this CI
const events = await mcp.callTool('list_active_events', {
  query: `node=${ci.sys_id}`,
  limit: 10
});

// 5. Find similar incidents
const similarIncidents = await mcp.callTool('query_records', {
  table: 'incident',
  query: `cmdb_ci=${ci.sys_id}^opened_at>javascript:gs.daysAgoStart(30)`,
  limit: 5
});
```

---

### Workflow 2: Change Impact Analysis

**Scenario:** Assess impact before scheduling a change.

```javascript
// 1. Get the service being changed
const service = await mcp.callTool('service_mapping_summary', {
  service_sys_id: 'SERVICE_SYS_ID'
});

// 2. Get all related CIs
console.log(`Service has ${service.related_cis_count} dependent CIs`);

// 3. Check for active incidents on related CIs
for (const ci of service.related_cis) {
  const incidents = await mcp.callTool('query_records', {
    table: 'incident',
    query: `cmdb_ci=${ci.ci_id.value}^active=true`,
    fields: 'number,short_description,priority'
  });
  
  if (incidents.count > 0) {
    console.log(`Warning: ${ci.ci_id.display_value} has ${incidents.count} active incidents`);
  }
}

// 4. Check CMDB health for these CIs
const health = await mcp.callTool('cmdb_health_dashboard', {});
console.log(`CMDB completeness: ${health.server_metrics.ip_completeness}%`);

// 5. Create the change request if safe
if (allClear) {
  const change = await mcp.callTool('create_change_request', {
    short_description: 'Planned service upgrade',
    assignment_group: 'GROUP_SYS_ID',
    priority: '3',
    risk: '3'
  });
}
```

---

### Workflow 3: ITOM Health Check

**Scenario:** Daily health check of discovery infrastructure.

```javascript
// 1. Check all MID servers are up
const midServers = await mcp.callTool('list_mid_servers', {
  active_only: false
});

const downMids = midServers.mid_servers.filter(mid => mid.status !== 'Up');
if (downMids.length > 0) {
  console.log(`Alert: ${downMids.length} MID servers are down!`);
}

// 2. Check discovery schedules ran successfully
const schedules = await mcp.callTool('list_discovery_schedules', {
  active_only: true
});

console.log(`${schedules.count} active discovery schedules`);

// 3. Check for critical events
const criticalEvents = await mcp.callTool('list_active_events', {
  query: 'severity=1^state!=Closed',
  limit: 50
});

console.log(`${criticalEvents.count} critical events need attention`);

// 4. CMDB health check
const cmdbHealth = await mcp.callTool('cmdb_health_dashboard', {});

if (parseFloat(cmdbHealth.server_metrics.ip_completeness) < 90) {
  console.log('Warning: Server IP completeness below 90%');
}
```

---

## Error Handling Examples

### Error Reference

| Error Code | Situation | Cause | Solution |
|-----------|-----------|-------|----------|
| TABLE_NOT_ALLOWED | Query restricted table | Not in allowlist | Add to ALLOWED_TABLES or set ALLOW_ANY_TABLE=true |
| WRITE_NOT_ENABLED | Write operation blocked | WRITE_ENABLED=false | Set WRITE_ENABLED=true |
| VALIDATION_ERROR | Invalid parameter | Malformed sys_id | Verify 32-character hex string |
| AUTHENTICATION_FAILED | OAuth failure | Invalid credentials | Check CLIENT_ID/SECRET |
| RATE_LIMITED | Too many requests | Exceeded API limit | Implement retry logic with backoff |

---

### Example: Table Not Allowed

**Tool Call:**
```json
{
  "tool": "query_records",
  "arguments": {
    "table": "sys_user_password",
    "query": "active=true"
  }
}
```

**Error Response:**
```json
{
  "error": "Table \"sys_user_password\" is not in allowlist. Enable ALLOW_ANY_TABLE=true or add to ALLOWED_TABLES",
  "code": "TABLE_NOT_ALLOWED"
}
```

---

### Example: Write Operation Blocked

**Tool Call:**
```json
{
  "tool": "create_change_request",
  "arguments": {
    "short_description": "Test change"
  }
}
```

**Error Response (when WRITE_ENABLED=false):**
```json
{
  "error": "Write operation \"create_change_request\" not allowed. Enable WRITE_ENABLED=true",
  "code": "WRITE_NOT_ENABLED"
}
```

---

### Example: Invalid sys_id Format

**Tool Call:**
```json
{
  "tool": "get_record",
  "arguments": {
    "table": "incident",
    "sys_id": "INVALID_ID"
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid sys_id format. Must be 32-character hex string",
  "code": "VALIDATION_ERROR"
}
```

---

## Tips for Effective Usage

### 1. Start with Schema
Always check table schema before querying to understand available fields:
```json
{"tool": "get_table_schema", "arguments": {"tableName": "incident"}}
```

### 2. Use Field Filtering
Request only needed fields to reduce response size:
```json
{"fields": "number,short_description,state,priority"}
```

### 3. Leverage Encoded Queries

Build complex queries with ServiceNow's encoded query syntax:

| Operator | Meaning | Example |
|----------|---------|---------|
| `^` | AND | `active=true^priority=1` |
| `^OR` | OR | `priority=1^ORpriority=2` |
| `^NQ` | New Query (parentheses) | `(field1=val1^field2=val2)^ORfield3=val3` |
| `LIKE` | Contains | `descriptionLIKEDatabase` |
| `STARTSWITH` | Begins with | `nameSTARTSWITHHello` |
| `>`, `<`, `>=`, `<=` | Comparisons | `opened_at>2024-01-01` |
| `.` | Dot-walk (related) | `assignment_group.name=Database` |

Example: `active=true^priority=1^ORpriority=2^assignment_groupLIKEDatabase`

### 4. Order Results
Use `orderBy` with `-` prefix for descending:
```json
{"orderBy": "-sys_updated_on"}  // Most recent first
```

### 5. Paginate Large Result Sets
```json
{
  "limit": 100,
  "offset": 0    // First page
}
// Then offset: 100, 200, 300, etc.
```

### 6. Dot-Walk for Related Data
Access related table fields:
```json
{"query": "assignment_group.name=Database^cmdb_ci.location.nameLIKEDC-EAST"}
```

### 7. Monitor Rate Limits
The client includes automatic retry with exponential backoff, but be mindful of:
- ServiceNow instance rate limits
- Large queries (use pagination)
- Frequent polling (cache when possible)

---

## Next Steps

- Review [SECURITY.md](SECURITY.md) for security best practices
- Check [CONTRIBUTING.md](CONTRIBUTING.md) to extend functionality
- See [README.md](README.md) for configuration options

