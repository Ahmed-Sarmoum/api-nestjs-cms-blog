import { User } from "src/auth/entities/user.entity"
import { Category } from "src/category/entities/category.entity"
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, BeforeInsert } from "typeorm"
import slugify from "slugify"
import { Exclude } from "class-transformer"

@Entity("posts")
export class Post {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    content: string

    @Column()
    slug: string

    @Column()
    mainImageUrl: string

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updated_at: Date

    @Column()
    @Exclude()
    userId: number

    @Column({default: 1})
    @Exclude()
    categoryId: number

    @ManyToOne(() => User, (user) => user.post, {
        eager: true // get Details
    })
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'id'
    })
    user: User

    @ManyToOne(() => Category, (catigory) => catigory.post, {
        eager: true
    })
    category: Category

    @BeforeInsert()
    slugifyPost() {
        this.slug = slugify(this.title.substring(0, 20), {
            lower: true,
            replacement: '_'
        })
    }
   
}
