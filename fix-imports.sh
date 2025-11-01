#!/bin/bash

# Script pour corriger les imports incorrects

set -e

echo "🔧 Correction des imports..."

# Corriger les imports vers user.entity.ts
find src/modules -name "*.entity.ts" -exec sed -i "s|'../../users/user.entity'|'../../users/entities/user.entity'|g" {} \;

# Corriger les noms de fichiers d'entités avec casse incorrecte
# burn-charts
if [ -f "src/modules/burn-charts/entities/BurnData.entity.ts" ]; then
  mv "src/modules/burn-charts/entities/BurnData.entity.ts" "src/modules/burn-charts/entities/burn-data.entity.ts" 2>/dev/null || true
fi

# capacity-planning
if [ -f "src/modules/capacity-planning/entities/CapacityPlan.entity.ts" ]; then
  mv "src/modules/capacity-planning/entities/CapacityPlan.entity.ts" "src/modules/capacity-planning/entities/capacity-plan.entity.ts" 2>/dev/null || true
fi

# cumulative-flow
if [ -f "src/modules/cumulative-flow/entities/CumulativeFlow.entity.ts" ]; then
  mv "src/modules/cumulative-flow/entities/CumulativeFlow.entity.ts" "src/modules/cumulative-flow/entities/cumulative-flow.entity.ts" 2>/dev/null || true
fi

# dependencies
if [ -f "src/modules/dependencies/entities/Dependency.entity.ts" ]; then
  mv "src/modules/dependencies/entities/Dependency.entity.ts" "src/modules/dependencies/entities/dependency.entity.ts" 2>/dev/null || true
fi

# epics
if [ -f "src/modules/epics/entities/Epic.entity.ts" ]; then
  mv "src/modules/epics/entities/Epic.entity.ts" "src/modules/epics/entities/epic.entity.ts" 2>/dev/null || true
fi

# initiatives
if [ -f "src/modules/initiatives/entities/Initiative.entity.ts" ]; then
  mv "src/modules/initiatives/entities/Initiative.entity.ts" "src/modules/initiatives/entities/initiative.entity.ts" 2>/dev/null || true
fi

# Corriger les imports dans les modules et services
find src/modules -name "*.module.ts" -exec sed -i "s|./entities/BurnData.entity|./entities/burn-data.entity|g" {} \;
find src/modules -name "*.service.ts" -exec sed -i "s|./entities/BurnData.entity|./entities/burn-data.entity|g" {} \;

find src/modules -name "*.module.ts" -exec sed -i "s|./entities/CapacityPlan.entity|./entities/capacity-plan.entity|g" {} \;
find src/modules -name "*.service.ts" -exec sed -i "s|./entities/CapacityPlan.entity|./entities/capacity-plan.entity|g" {} \;

find src/modules -name "*.module.ts" -exec sed -i "s|./entities/CumulativeFlow.entity|./entities/cumulative-flow.entity|g" {} \;
find src/modules -name "*.service.ts" -exec sed -i "s|./entities/CumulativeFlow.entity|./entities/cumulative-flow.entity|g" {} \;

find src/modules -name "*.module.ts" -exec sed -i "s|./entities/Dependency.entity|./entities/dependency.entity|g" {} \;
find src/modules -name "*.service.ts" -exec sed -i "s|./entities/Dependency.entity|./entities/dependency.entity|g" {} \;

find src/modules -name "*.module.ts" -exec sed -i "s|./entities/Epic.entity|./entities/epic.entity|g" {} \;
find src/modules -name "*.service.ts" -exec sed -i "s|./entities/Epic.entity|./entities/epic.entity|g" {} \;

find src/modules -name "*.module.ts" -exec sed -i "s|./entities/Initiative.entity|./entities/initiative.entity|g" {} \;
find src/modules -name "*.service.ts" -exec sed -i "s|./entities/Initiative.entity|./entities/initiative.entity|g" {} \;

echo "✅ Imports corrigés!"
