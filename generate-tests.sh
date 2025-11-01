#!/bin/bash

# Script pour générer automatiquement les tests manquants pour tous les modules
# Basé sur l'analyse de PROJECT_COMPLETENESS_ANALYSIS.md

set -e

echo "🧪 Génération automatique des tests manquants..."
echo ""

# Liste des modules sans tests (identifiés dans l'analyse)
MODULES=(
  "attachments"
  "watchers"
  "activity"
  "issue-links"
  "roles"
  "custom-fields"
  "notifications"
  "filters"
  "dashboards"
  "issue-history"
  "webhooks"
)

# Fonction pour créer un test de service basique
create_service_test() {
  local module=$1
  local module_capitalized=$(echo "$module" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2));}1' | sed 's/ //g')
  local service_name="${module_capitalized}Service"
  local file_path="src/modules/${module}/__tests__/${module}.service.spec.ts"

  mkdir -p "src/modules/${module}/__tests__"

  cat > "$file_path" << EOF
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ${service_name} } from '../${module}.service';
import { NotFoundException } from '@nestjs/common';

describe('${service_name}', () => {
  let service: ${service_name};
  let repository: Repository<any>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getManyAndCount: jest.fn(),
      getOne: jest.fn(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ${service_name},
        {
          provide: getRepositoryToken(Object),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<${service_name}>(${service_name});
    repository = module.get(getRepositoryToken(Object));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const mockItems = [{ id: '1' }, { id: '2' }];
      mockRepository.find.mockResolvedValue(mockItems);

      const result = await service.findAll();

      expect(result).toEqual(mockItems);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single item', async () => {
      const mockItem = { id: '1', name: 'Test' };
      mockRepository.findOne.mockResolvedValue(mockItem);

      const result = await service.findOne('1');

      expect(result).toEqual(mockItem);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: expect.any(Array),
      });
    });

    it('should throw NotFoundException when item not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new item', async () => {
      const createDto = { name: 'New Item' };
      const mockCreatedItem = { id: '1', ...createDto };

      mockRepository.create.mockReturnValue(mockCreatedItem);
      mockRepository.save.mockResolvedValue(mockCreatedItem);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCreatedItem);
      expect(mockRepository.create).toHaveBeenCalledWith(expect.objectContaining(createDto));
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove an item', async () => {
      const mockItem = { id: '1', name: 'Test' };
      mockRepository.findOne.mockResolvedValue(mockItem);
      mockRepository.remove.mockResolvedValue(mockItem);

      await service.remove('1');

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.remove).toHaveBeenCalledWith(mockItem);
    });

    it('should throw NotFoundException when trying to remove non-existent item', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });
});
EOF

  echo "  ✅ Créé: $file_path"
}

# Générer les tests pour chaque module
echo "📝 Génération des tests de service..."
for module in "${MODULES[@]}"; do
  create_service_test "$module"
done

echo ""
echo "✨ Génération terminée!"
echo ""
echo "📊 Résumé:"
echo "  - Modules traités: ${#MODULES[@]}"
echo "  - Tests créés: ${#MODULES[@]}"
echo ""
echo "💡 Prochaines étapes:"
echo "  1. Vérifiez les tests générés"
echo "  2. Ajustez les imports et entités selon chaque module"
echo "  3. Exécutez: npm run test"
echo ""
