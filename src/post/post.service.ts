import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {

  constructor(@InjectRepository(Post) private readonly repo: Repository<Post>) {}


  async create(createPostDto: CreatePostDto) {
    const slug = createPostDto.title.split(" ").join("_").toLocaleLowerCase()
    return await this.repo.insert({ ...createPostDto, slug })
  }

  async findAll() {
    return await this.repo.find()
  }

  async findOne(id: number) {
    const post =  await this.repo.findOne({where: {id: id}})
    if (!post) {
      throw new BadRequestException('Post not found!')
    }
    return post
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
      return await this.repo.update(id, updatePostDto)
  }

  async remove(id: number) {
    return await this.repo.delete(id)
  }
}
