#!/bin/bash

# Script complet pour corriger tous les problèmes d'imports et de casse

set -e

echo "🔧 Correction complète des problèmes..."
echo ""

# 1. Corriger les imports vers user.entity.ts
echo "📝 Correction des imports user.entity..."
find src/modules -name "*.entity.ts" -exec sed -i "s|'../../users/user.entity'|'../../users/entities/user.entity'|g" {} \;
find src/modules -name "*.module.ts" -exec sed -i "s|'../users/user.entity'|'../users/entities/user.entity'|g" {} \;
find src/modules -name "*.service.ts" -exec sed -i "s|'../users/user.entity'|'../users/entities/user.entity'|g" {} \;

# 2. Corriger les imports comment.entity
echo "📝 Correction des imports comment.entity..."
find src/modules -name "*.module.ts" -exec sed -i "s|'../comments/comment.entity'|'../comments/entities/comment.entity'|g" {} \;
find src/modules -name "*.service.ts" -exec sed -i "s|'../comments/comment.entity'|'../comments/entities/comment.entity'|g" {} \;

# 3. Corriger les imports work-log.entity
echo "📝 Correction des imports work-log.entity..."
find src/modules -name "*.module.ts" -exec sed -i "s|'../work-logs/work-log.entity'|'../work-logs/entities/work-log.entity'|g" {} \;
find src/modules -name "*.service.ts" -exec sed -i "s|'../work-logs/work-log.entity'|'../work-logs/entities/work-log.entity'|g" {} \;

# 4. Renommer les fichiers avec casse incorrecte
echo "📂 Renommage des fichiers d'entités..."

# Release -> release
[ -f "src/modules/release-management/entities/Release.entity.ts" ] && \
  mv "src/modules/release-management/entities/Release.entity.ts" "src/modules/release-management/entities/release.entity.ts" 2>/dev/null || true

# ResourceAllocation -> resource-allocation
[ -f "src/modules/resource-allocation/entities/ResourceAllocation.entity.ts" ] && \
  mv "src/modules/resource-allocation/entities/ResourceAllocation.entity.ts" "src/modules/resource-allocation/entities/resource-allocation.entity.ts" 2>/dev/null || true

# Retrospective -> retrospective
[ -f "src/modules/retrospectives/entities/Retrospective.entity.ts" ] && \
  mv "src/modules/retrospectives/entities/Retrospective.entity.ts" "src/modules/retrospectives/entities/retrospective.entity.ts" 2>/dev/null || true

# Roadmap -> roadmap
[ -f "src/modules/roadmaps/entities/Roadmap.entity.ts" ] && \
  mv "src/modules/roadmaps/entities/Roadmap.entity.ts" "src/modules/roadmaps/entities/roadmap.entity.ts" 2>/dev/null || true

# SprintReport -> sprint-report
[ -f "src/modules/sprint-reports/entities/SprintReport.entity.ts" ] && \
  mv "src/modules/sprint-reports/entities/SprintReport.entity.ts" "src/modules/sprint-reports/entities/sprint-report.entity.ts" 2>/dev/null || true

# StoryMap -> story-map
[ -f "src/modules/story-mapping/entities/StoryMap.entity.ts" ] && \
  mv "src/modules/story-mapping/entities/StoryMap.entity.ts" "src/modules/story-mapping/entities/story-map.entity.ts" 2>/dev/null || true

# Velocity -> velocity
[ -f "src/modules/velocity-tracking/entities/Velocity.entity.ts" ] && \
  mv "src/modules/velocity-tracking/entities/Velocity.entity.ts" "src/modules/velocity-tracking/entities/velocity.entity.ts" 2>/dev/null || true

# 5. Corriger les imports dans modules et services
echo "📝 Correction des imports d'entités..."

find src/modules -name "*.module.ts" -o -name "*.service.ts" | while read file; do
  sed -i "s|./entities/Release.entity|./entities/release.entity|g" "$file"
  sed -i "s|./entities/ResourceAllocation.entity|./entities/resource-allocation.entity|g" "$file"
  sed -i "s|./entities/Retrospective.entity|./entities/retrospective.entity|g" "$file"
  sed -i "s|./entities/Roadmap.entity|./entities/roadmap.entity|g" "$file"
  sed -i "s|./entities/SprintReport.entity|./entities/sprint-report.entity|g" "$file"
  sed -i "s|./entities/StoryMap.entity|./entities/story-map.entity|g" "$file"
  sed -i "s|./entities/Velocity.entity|./entities/velocity.entity|g" "$file"
done

# 6. Corriger le module SlaModule
echo "📝 Correction du module SLA..."
sed -i "s|import { SlaModule }|import { SLAModule }|g" src/app.module.ts

# 7. Corriger les imports de modules avec casse incorrecte dans app.module.ts
echo "📝 Correction des imports de modules dans app.module.ts..."
sed -i "s|'./modules/roadmaps/Roadmaps.module'|'./modules/roadmaps/roadmaps.module'|g" src/app.module.ts
sed -i "s|'./modules/initiatives/Initiatives.module'|'./modules/initiatives/initiatives.module'|g" src/app.module.ts
sed -i "s|'./modules/epics/Epics.module'|'./modules/epics/epics.module'|g" src/app.module.ts
sed -i "s|'./modules/dependencies/Dependencies.module'|'./modules/dependencies/dependencies.module'|g" src/app.module.ts
sed -i "s|'./modules/capacity-planning/CapacityPlanning.module'|'./modules/capacity-planning/capacity-planning.module'|g" src/app.module.ts
sed -i "s|'./modules/resource-allocation/ResourceAllocation.module'|'./modules/resource-allocation/resource-allocation.module'|g" src/app.module.ts
sed -i "s|'./modules/velocity-tracking/VelocityTracking.module'|'./modules/velocity-tracking/velocity-tracking.module'|g" src/app.module.ts
sed -i "s|'./modules/burn-charts/BurnCharts.module'|'./modules/burn-charts/burn-charts.module'|g" src/app.module.ts
sed -i "s|'./modules/sprint-reports/SprintReports.module'|'./modules/sprint-reports/sprint-reports.module'|g" src/app.module.ts
sed -i "s|'./modules/retrospectives/Retrospectives.module'|'./modules/retrospectives/retrospectives.module'|g" src/app.module.ts
sed -i "s|'./modules/release-management/ReleaseManagement.module'|'./modules/release-management/release-management.module'|g" src/app.module.ts
sed -i "s|'./modules/story-mapping/StoryMapping.module'|'./modules/story-mapping/story-mapping.module'|g" src/app.module.ts
sed -i "s|'./modules/cumulative-flow/CumulativeFlow.module'|'./modules/cumulative-flow/cumulative-flow.module'|g" src/app.module.ts

echo ""
echo "✅ Toutes les corrections appliquées!"
echo ""
