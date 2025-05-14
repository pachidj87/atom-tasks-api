import { Service } from 'typedi';

import { RepositoryService } from '../../services/repository.service';
import { User } from '../../entities/user.entity';

@Service()
export class UsersService {
  constructor(
    private readonly repositoryService: RepositoryService,
  ) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.repositoryService.getDocument('users', id);
    return user;
  }
}