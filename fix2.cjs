const fs = require('fs');
let content = fs.readFileSync('app/Http/Controllers/AnalyticsController.php', 'utf8');

content = content.replace(/->groupBy\(\['date', 'event_type'\]\)/g, '->groupByRaw(\'DATE(created_at), event_type\')');

fs.writeFileSync('app/Http/Controllers/AnalyticsController.php', content);
console.log('Fixed AnalyticsController');
