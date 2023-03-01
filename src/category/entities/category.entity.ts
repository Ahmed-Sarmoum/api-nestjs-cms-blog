import { Post } from 'src/post/entities/post.entity'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm' 

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column() 
    title: string

    @Column()
    description: string

    @OneToMany(() => Post, (post) => post.category)
    post: Post
}
