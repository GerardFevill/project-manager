const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'src/modules');

function findControllers(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findControllers(filePath, fileList);
    } else if (file.endsWith('.controller.ts')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function extractEndpoints(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const endpoints = [];

  // Extract controller base path
  const controllerMatch = content.match(/@Controller\(['"]([^'"]*)['"]\)/);
  const basePath = controllerMatch ? controllerMatch[1] : '';

  // Extract all HTTP methods
  const httpMethods = ['Get', 'Post', 'Put', 'Delete', 'Patch'];

  httpMethods.forEach(method => {
    const regex = new RegExp(`@${method}\\(['"]?([^'"\\)]*)?['"]?\\)`, 'g');
    let match;

    while ((match = regex.exec(content)) !== null) {
      const route = match[1] || '';
      const fullPath = `/${basePath}${route ? '/' + route : ''}`.replace(/\/+/g, '/');
      endpoints.push({
        method: method.toUpperCase(),
        path: fullPath
      });
    }
  });

  return { basePath, endpoints };
}

const controllers = findControllers(controllersDir);
const allEndpoints = [];
const groupedEndpoints = {};

console.log('📊 ANALYSE DES ENDPOINTS\n');
console.log(`Nombre de contrôleurs trouvés: ${controllers.length}\n`);

controllers.forEach(controller => {
  const moduleName = path.basename(path.dirname(controller));
  const { basePath, endpoints } = extractEndpoints(controller);

  if (endpoints.length > 0) {
    if (!groupedEndpoints[basePath]) {
      groupedEndpoints[basePath] = [];
    }
    groupedEndpoints[basePath].push(...endpoints);
    allEndpoints.push(...endpoints);
  }
});

// Sort and display by module
console.log('═══════════════════════════════════════════════════════════\n');
console.log('📋 ENDPOINTS PAR MODULE\n');
console.log('═══════════════════════════════════════════════════════════\n');

const sortedGroups = Object.keys(groupedEndpoints).sort();
sortedGroups.forEach(basePath => {
  const endpoints = groupedEndpoints[basePath];
  console.log(`\n🔹 /${basePath} (${endpoints.length} endpoints)`);
  console.log('─'.repeat(60));

  endpoints.forEach(ep => {
    const methodColor = {
      'GET': '🟢',
      'POST': '🟡',
      'PUT': '🔵',
      'DELETE': '🔴',
      'PATCH': '🟣'
    }[ep.method] || '⚪';

    console.log(`  ${methodColor} ${ep.method.padEnd(6)} ${ep.path}`);
  });
});

console.log('\n\n═══════════════════════════════════════════════════════════\n');
console.log('📊 STATISTIQUES GLOBALES\n');
console.log('═══════════════════════════════════════════════════════════\n');

const methodCounts = allEndpoints.reduce((acc, ep) => {
  acc[ep.method] = (acc[ep.method] || 0) + 1;
  return acc;
}, {});

console.log(`Total d'endpoints: ${allEndpoints.length}`);
console.log(`Modules avec endpoints: ${sortedGroups.length}\n`);

console.log('Par méthode HTTP:');
Object.keys(methodCounts).sort().forEach(method => {
  console.log(`  ${method}: ${methodCounts[method]}`);
});

console.log('\n═══════════════════════════════════════════════════════════\n');
console.log('📝 COMPARAISON AVEC JIRA API\n');
console.log('═══════════════════════════════════════════════════════════\n');

const jiraCategories = {
  'Issues': 150,
  'Projects': 80,
  'Users & Groups': 60,
  'Workflows': 40,
  'Fields & Screens': 80,
  'Permissions & Roles': 50,
  'Webhooks & Notifications': 40,
  'System / Audit': 25,
  'Filters / Dashboards / JQL': 50,
  'Configurations diverses': 70
};

const jiraTotal = Object.values(jiraCategories).reduce((sum, val) => sum + val, 0);

console.log(`\nJira API Reference: ~${jiraTotal} endpoints`);
console.log(`Votre API: ${allEndpoints.length} endpoints`);
console.log(`\nCouverture: ${((allEndpoints.length / jiraTotal) * 100).toFixed(1)}%`);

console.log('\n\nDétail par catégorie Jira:');
Object.keys(jiraCategories).forEach(category => {
  const count = jiraCategories[category];
  console.log(`  ${category.padEnd(30)}: ${count} endpoints`);
});

console.log('\n═══════════════════════════════════════════════════════════\n');
