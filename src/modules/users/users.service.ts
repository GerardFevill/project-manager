import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<{ data: User[]; total: number; page: number; lastPage: number }> {
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

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, firstName, lastName } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Check email uniqueness if being updated
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    // Hash password if being updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    user.updatedAt = new Date();

    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}

  // ========== USER SEARCH & QUERIES ==========

  async searchWithQuery(query: string): Promise<any> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username LIKE :query OR user.email LIKE :query', { query: `%${query}%` })
      .take(20)
      .getMany();
    return { query, results: users };
  }

  async searchAssignableMultiProject(projectIds: string): Promise<any> {
    // TODO: Filter users who can be assigned in these projects
    const users = await this.findAll();
    return { projectIds, users };
  }

  async userPicker(query: string): Promise<any> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username LIKE :query OR user.email LIKE :query', { query: `%${query}%` })
      .take(10)
      .getMany();

    return {
      query,
      suggestions: users.map(u => ({
        id: u.id,
        name: u.username,
        displayName: u.username,
        avatarUrl: null,
      }))
    };
  }

  // ========== USER RELATIONSHIPS ==========

  async getUserGroups(id: string): Promise<any> {
    await this.findOne(id);
    // TODO: Get from user_groups table
    return { userId: id, groups: [] };
  }

  async getUserPermissions(id: string): Promise<any> {
    await this.findOne(id);
    // TODO: Calculate user permissions
    return { userId: id, permissions: [] };
  }

  // ========== USER PROPERTIES ==========

  async getUserProperties(id: string): Promise<any> {
    await this.findOne(id);
    // TODO: Get from user_properties table
    return { userId: id, properties: {} };
  }

  async setUserProperty(id: string, key: string, value: any): Promise<any> {
    await this.findOne(id);
    // TODO: Store in user_properties table
    return { userId: id, key, value };
  }

  async deleteUserProperty(id: string, key: string): Promise<void> {
    await this.findOne(id);
    // TODO: Delete from user_properties table
  }

  // ========== USER AVATAR ==========

  async getUserAvatar(id: string): Promise<any> {
    await this.findOne(id);
    return { userId: id, avatarUrl: null };
  }

  async uploadUserAvatar(id: string, avatarData: any): Promise<any> {
    const user = await this.findOne(id);
    // TODO: Store avatar URL
    return { userId: id, avatarUrl: avatarData.url };
  }

  // ========== BULK OPERATIONS ==========

  async getBulkUsers(userIds: string): Promise<any> {
    const ids = userIds.split(',');
    const users = await this.userRepository
      .createQueryBuilder('user')
      .whereInIds(ids)
      .getMany();
    return { users };
  }

  async getUserMigrationData(userIds: string): Promise<any> {
    const ids = userIds.split(',');
    const users = await this.userRepository
      .createQueryBuilder('user')
      .whereInIds(ids)
      .getMany();
    return { migrationData: users };
  }

  async getUserByEmail(email: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    return { email, user };
  }
}
