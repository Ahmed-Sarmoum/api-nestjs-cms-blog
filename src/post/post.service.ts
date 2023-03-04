import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {

  constructor(@InjectRepository(Post) private readonly repo: Repository<Post>) {}


  async create(createPostDto: CreatePostDto, user: User) {
    const post = new Post()
    post.userId = 1
    post.title = createPostDto.title
    Object.assign(post, createPostDto)

    this.repo.create(post)
    return this.repo.save(post)

  }

  async findAll(query?: string) {    
    const myQuery = this.repo
                    .createQueryBuilder('post')
                    .leftJoinAndSelect('post.category', 'category')
                    .leftJoinAndSelect('post.user', 'user')

    if (!(Object.keys(query).length === 0) && query.constructor === Object) {
      const queryKeys = Object.keys(query)

      if(queryKeys.includes('title')) {
        myQuery.where('post.title LIKE :title', {title: `%${query['title']}%`})
      }

      if (queryKeys.includes('sort')) {
        myQuery.orderBy('post.title', query['sort'].toUpperCase())
      }

      if (queryKeys.includes('category')) {
        myQuery.andWhere('category.title = :cat', {cat: query['category']})
      }

      return await myQuery.getMany()

    } else {
      return await myQuery.getMany()
    }
  }

  async findOne(id: number) {
    const post =  await this.repo.findOne({where: {id: id}})
    if (!post) {
      throw new BadRequestException('Post not found!')
    }
    return post
  }

  async findBySlug(slug: string)  {
    try {
      const post = await this.repo.findOneOrFail({where: {slug: slug}})
      return post
    } catch(err) {
      throw new BadRequestException(`Post with slug ${slug} not found!`)
    }
  }

  async update(slug: string, updatePostDto: UpdatePostDto) {
      const post = await this.findBySlug(slug)

      if(!post) {
        throw new BadRequestException('Post not found!')
      }

      post.updated_at = new Date(Date.now())
      post.category = updatePostDto.category

      Object.assign(post, updatePostDto)

      return await this.repo.save(post)
  }

  async remove(id: number) {
    const post = await this.findOne(id)

      if(!post) {
        throw new BadRequestException('Post not found!')
      }

      await this.repo.remove(post)

      return {success: true, post}
  }
}
