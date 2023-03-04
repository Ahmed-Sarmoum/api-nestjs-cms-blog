import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {

  constructor(@InjectRepository(Category) private readonly repo: Repository<Category>) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = new Category()
    Object.assign(category, createCategoryDto)
    this.repo.create(category)
    return await this.repo.save(category)
  }

  findAll() {
    return this.repo.find()
  }

  findOne(id: number) {
    return this.repo.findOne({where: {id: id}})
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id)
    if (!category) {
      throw new BadRequestException('Category Not Found!')
    }
    Object.assign(category, updateCategoryDto)
    return await this.repo.save(category)
  }

  async remove(id: number, res: Response) {
    const category = await this.findOne(id)

    if (!category) {
      throw new BadRequestException('Category Not Found!')
    }

    try {
      await this.repo.remove(category)
      return res.status(200).json({success: true, category: category})
    }catch(err) {
      throw new BadRequestException('Operation Failed!')
    }
  }
}
