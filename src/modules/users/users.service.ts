import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserProperty } from './entities/user-property.entity';
import { UserAvatar } from './entities/user-avatar.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * UsersService
 *
 * Service complet pour la gestion des utilisateurs avec toutes les fonctionnalités Jira:
 * - CRUD de base
 * - Authentification et sécurité (hash de password)
 * - Recherche et queries (search, picker, bulk)
 * - Relations (groups, permissions)
 * - Propriétés utilisateur (key-value properties)
 * - Avatar
 * - Opérations en masse
 * - Migration de données
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProperty)
    private readonly userPropertyRepository: Repository<UserProperty>,
    @InjectRepository(UserAvatar)
    private readonly userAvatarRepository: Repository<UserAvatar>,
  ) {}

  // ==================== CRUD DE BASE ====================

  /**
   * Récupère tous les utilisateurs avec pagination
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: User[]; total: number; page: number; lastPage: number }> {
    const [data, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['groups'],
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  /**
   * Récupère un utilisateur par son ID
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['groups'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Récupère un utilisateur par son username
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['groups'],
    });
  }

  /**
   * Récupère un utilisateur par son email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['groups'],
    });
  }

  /**
   * Crée un nouvel utilisateur
   * - Vérifie que username et email sont uniques
   * - Hash le password avec bcrypt (salt rounds: 10)
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, firstName, lastName } = createUserDto;

    // Vérifier que le username et l'email n'existent pas déjà
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash du password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.userRepository.save(user);
  }

  /**
   * Met à jour un utilisateur
   * - Vérifie l'unicité de l'email si modifié
   * - Hash le password si modifié
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Vérifier l'unicité de l'email si modifié
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    // Hash du password si modifié
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    user.updatedAt = new Date();

    return this.userRepository.save(user);
  }

  /**
   * Supprime un utilisateur
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  // ==================== RECHERCHE & QUERIES ====================

  /**
   * Recherche d'utilisateurs par query
   * Recherche dans username et email
   * Limite à 20 résultats
   */
  async searchWithQuery(query: string): Promise<any> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username LIKE :query', { query: `%${query}%` })
      .orWhere('user.email LIKE :query', { query: `%${query}%` })
      .orWhere('user.firstName LIKE :query', { query: `%${query}%` })
      .orWhere('user.lastName LIKE :query', { query: `%${query}%` })
      .leftJoinAndSelect('user.groups', 'groups')
      .orderBy('user.username', 'ASC')
      .take(20)
      .getMany();

    return {
      query,
      total: users.length,
      results: users,
    };
  }

  /**
   * Recherche d'utilisateurs assignables dans plusieurs projets
   * Retourne les utilisateurs qui peuvent être assignés dans les projets spécifiés
   */
  async searchAssignableMultiProject(projectIds: string): Promise<any> {
    // TODO: Filtrer les utilisateurs avec permission d'assignation dans ces projets
    // Pour l'instant, retourner tous les utilisateurs actifs
    const ids = projectIds.split(',').filter(id => id.trim());
    const users = await this.userRepository.find({
      where: { isActive: true },
      relations: ['groups'],
      take: 50,
    });

    return {
      projectIds: ids,
      users: users.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        displayName: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username,
        avatarUrl: null,
        isActive: u.isActive,
      })),
    };
  }

  /**
   * User picker pour sélection rapide
   * Format optimisé pour les composants de sélection UI
   * Limite à 10 résultats
   */
  async userPicker(query: string): Promise<any> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.isActive = :isActive', { isActive: true })
      .andWhere(
        '(user.username LIKE :query OR user.email LIKE :query OR user.firstName LIKE :query OR user.lastName LIKE :query)',
        { query: `%${query}%` }
      )
      .orderBy('user.username', 'ASC')
      .take(10)
      .getMany();

    return {
      query,
      suggestions: users.map(u => ({
        id: u.id,
        name: u.username,
        displayName: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username,
        email: u.email,
        avatarUrl: null,
      })),
    };
  }

  // ==================== RELATIONS ====================

  /**
   * Récupère les groupes d'un utilisateur
   */
  async getUserGroups(id: string): Promise<any> {
    const user = await this.findOne(id);

    // TODO: Implémenter la table user_groups pour stocker les memberships
    // Pour l'instant, retourner la relation directe
    return {
      userId: id,
      username: user.username,
      groups: user.groups || [],
      // Structure attendue:
      // groups: [
      //   { groupId: '1', groupName: 'Developers', role: 'member' }
      // ]
    };
  }

  /**
   * Récupère les permissions d'un utilisateur
   * Calcule les permissions à partir des groupes et rôles
   */
  async getUserPermissions(id: string): Promise<any> {
    const user = await this.findOne(id);

    // TODO: Calculer les permissions depuis les groupes et rôles
    // Permissions Jira standard:
    // - BROWSE_PROJECTS, CREATE_ISSUES, EDIT_ISSUES, DELETE_ISSUES
    // - ASSIGN_ISSUES, RESOLVE_ISSUES, CLOSE_ISSUES
    // - ADMINISTER_PROJECTS, ADMINISTER

    return {
      userId: id,
      username: user.username,
      permissions: [
        { key: 'BROWSE_PROJECTS', name: 'Browse Projects' },
        { key: 'CREATE_ISSUES', name: 'Create Issues' },
        { key: 'EDIT_ISSUES', name: 'Edit Issues' },
      ],
      // Structure complète:
      // permissions: [
      //   { key: 'permission_key', name: 'Permission Name', type: 'PROJECT' | 'GLOBAL' }
      // ]
    };
  }

  // ==================== PROPRIÉTÉS UTILISATEUR ====================

  /**
   * Récupère toutes les propriétés d'un utilisateur
   * Propriétés = paires clé-valeur personnalisées
   */
  async getUserProperties(id: string): Promise<any> {
    const user = await this.findOne(id);

    const properties = await this.userPropertyRepository.find({
      where: { userId: id },
      order: { propertyKey: 'ASC' },
    });

    const propertiesObj: Record<string, string> = {};
    properties.forEach(prop => {
      propertiesObj[prop.propertyKey] = prop.propertyValue;
    });

    return {
      userId: id,
      username: user.username,
      properties: propertiesObj,
    };
  }

  /**
   * Définit une propriété utilisateur
   * Crée ou met à jour la propriété
   */
  async setUserProperty(id: string, key: string, value: any): Promise<any> {
    const user = await this.findOne(id);

    // Chercher si la propriété existe déjà
    let property = await this.userPropertyRepository.findOne({
      where: { userId: id, propertyKey: key },
    });

    if (property) {
      // Mettre à jour
      property.propertyValue = String(value);
      property.updatedAt = new Date();
    } else {
      // Créer
      property = this.userPropertyRepository.create({
        userId: id,
        propertyKey: key,
        propertyValue: String(value),
      });
    }

    await this.userPropertyRepository.save(property);

    return {
      userId: id,
      username: user.username,
      property: {
        key: property.propertyKey,
        value: property.propertyValue,
        updatedAt: property.updatedAt,
      },
    };
  }

  /**
   * Supprime une propriété utilisateur
   */
  async deleteUserProperty(id: string, key: string): Promise<void> {
    const user = await this.findOne(id);

    const property = await this.userPropertyRepository.findOne({
      where: { userId: id, propertyKey: key },
    });

    if (property) {
      await this.userPropertyRepository.remove(property);
    }
  }

  // ==================== AVATAR ====================

  /**
   * Récupère l'avatar d'un utilisateur
   */
  async getUserAvatar(id: string): Promise<any> {
    const user = await this.findOne(id);

    const avatar = await this.userAvatarRepository.findOne({
      where: { userId: id },
    });

    return {
      userId: id,
      username: user.username,
      avatarUrl: avatar?.avatarUrl || null,
      avatarType: avatar?.avatarType || 'default',
      fileSize: avatar?.fileSize,
      mimeType: avatar?.mimeType,
      uploadedAt: avatar?.uploadedAt,
    };
  }

  /**
   * Upload un avatar pour l'utilisateur
   */
  async uploadUserAvatar(
    id: string,
    avatarData: { url: string; fileSize?: number; mimeType?: string },
  ): Promise<any> {
    const user = await this.findOne(id);

    // Chercher si un avatar existe déjà
    let avatar = await this.userAvatarRepository.findOne({
      where: { userId: id },
    });

    if (avatar) {
      // Mettre à jour
      avatar.avatarUrl = avatarData.url;
      avatar.avatarType = 'uploaded';
      avatar.fileSize = avatarData.fileSize || null;
      avatar.mimeType = avatarData.mimeType || null;
      avatar.uploadedAt = new Date();
    } else {
      // Créer
      avatar = this.userAvatarRepository.create({
        userId: id,
        avatarUrl: avatarData.url,
        avatarType: 'uploaded',
        fileSize: avatarData.fileSize,
        mimeType: avatarData.mimeType,
      });
    }

    await this.userAvatarRepository.save(avatar);

    return {
      userId: id,
      username: user.username,
      avatarUrl: avatar.avatarUrl,
      uploadedAt: avatar.uploadedAt,
    };
  }

  // ==================== OPÉRATIONS EN MASSE ====================

  /**
   * Récupère plusieurs utilisateurs par leurs IDs
   * Format: "id1,id2,id3"
   */
  async getBulkUsers(userIds: string): Promise<any> {
    const ids = userIds.split(',').map(id => id.trim()).filter(id => id);

    const users = await this.userRepository
      .createQueryBuilder('user')
      .whereInIds(ids)
      .leftJoinAndSelect('user.groups', 'groups')
      .getMany();

    return {
      requestedIds: ids,
      found: users.length,
      users: users.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        displayName: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username,
        isActive: u.isActive,
        groups: u.groups || [],
      })),
    };
  }

  /**
   * Récupère les données de migration pour des utilisateurs
   * Format: "id1,id2,id3"
   * Inclut toutes les données nécessaires pour migration/export
   */
  async getUserMigrationData(userIds: string): Promise<any> {
    const ids = userIds.split(',').map(id => id.trim()).filter(id => id);

    const users = await this.userRepository
      .createQueryBuilder('user')
      .whereInIds(ids)
      .leftJoinAndSelect('user.groups', 'groups')
      .getMany();

    return {
      requestedIds: ids,
      found: users.length,
      migrationData: users.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        isActive: u.isActive,
        groups: u.groups || [],
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        // TODO: Inclure properties, permissions, avatar
      })),
    };
  }

  /**
   * Récupère un utilisateur par email
   * Endpoint dédié pour recherche par email
   */
  async getUserByEmail(email: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['groups'],
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return {
      email,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
        isActive: user.isActive,
        groups: user.groups || [],
      },
    };
  }

  // ==================== VALIDATION & VÉRIFICATION ====================

  /**
   * Valide un password contre les règles de sécurité
   */
  async validatePassword(password: string, userId?: string): Promise<any> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Règles de validation du password
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      warnings.push('Password should contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      warnings.push('Password should contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      warnings.push('Password should contain at least one number');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      warnings.push('Password should contain at least one special character');
    }

    // Vérifier contre le password actuel si userId fourni
    if (userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user) {
        const isSamePassword = await bcrypt.compare(password, user.password);
        if (isSamePassword) {
          errors.push('New password must be different from current password');
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      strength: this.calculatePasswordStrength(password),
    };
  }

  /**
   * Calcule la force d'un password (0-4)
   * 0: Très faible, 1: Faible, 2: Moyen, 3: Fort, 4: Très fort
   */
  private calculatePasswordStrength(password: string): number {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return Math.min(strength, 4);
  }

  /**
   * Vérifie les credentials d'un utilisateur
   * Utilisé pour l'authentification
   */
  async verifyCredentials(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
