const fs = require('fs');
let content = fs.readFileSync('app/Services/AbTestingService.php', 'utf8');

content = content.replace(/->get\(\);\s*->groupBy\('landing_source', 'section_name'\);/g, '->get();');
content = content.replace(/\$rows = \$rows->get\(\);\s*\$grouped = \$rows->groupBy\('landing_source'\);/g, '// Group by landing source\n        $grouped = $rows->groupBy(\'landing_source\');');

fs.writeFileSync('app/Services/AbTestingService.php', content);
console.log('Fixed AbTestingService');
