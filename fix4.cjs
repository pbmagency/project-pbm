const fs = require('fs');
let content = fs.readFileSync('app/Services/AbTestingService.php', 'utf8');

content = content.replace(/\$rows = \$rows->groupByRaw\("json_extract\(event_data, '\$\.landing_source'\)"\)->get\(\);/g, '$rows = $rows->groupByRaw("json_extract(v.event_data, \'$.landing_source\')")->get();');

fs.writeFileSync('app/Services/AbTestingService.php', content);
console.log('Fixed AbTestingService line 485');
