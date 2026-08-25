const fs = require('fs');
let content = fs.readFileSync('app/Services/AbTestingService.php', 'utf8');

content = content.replace(/->groupBy\('landing_source', 'session_id'\)/g, '->groupByRaw("json_extract(event_data, \'$.landing_source\'), session_id")');
content = content.replace(/->groupBy\('landing_source', 'section_name'\)/g, '->groupByRaw("json_extract(event_data, \'$.landing_source\'), json_extract(event_data, \'$.section\')")');
content = content.replace(/->groupBy\('landing_source', 'event_type'\)/g, '->groupByRaw("json_extract(event_data, \'$.landing_source\'), event_type")');
content = content.replace(/->groupBy\('landing_source'\)/g, '->groupByRaw("json_extract(event_data, \'$.landing_source\')")');

fs.writeFileSync('app/Services/AbTestingService.php', content);
console.log('Fixed AbTestingService');
