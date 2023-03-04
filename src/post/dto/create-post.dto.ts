import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { User } from "src/auth/entities/user.entity"
import { Category } from "src/category/entities/category.entity"

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    content: string

    @IsNumber()
    @IsOptional()
    categoryId: number

    @IsOptional()
    @IsString()
    mainImgeUrl: string 

    @IsOptional()
    category: Category
 
}
