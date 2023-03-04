import { Post } from 'src/post/entities/post.entity'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from 'typeorm'
import * as bcrypte from 'bcryptjs'
import { UserRoles } from '../user-roles'

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstname: string
    
    @Column()
    lastname: string

    @Column()
    email: string

    @Column({select: false})
    password: string

    @Column({default: null})
    profilePic: string

    @Column({ type: 'enum', enum: UserRoles, default: UserRoles.Reader })
    roles: UserRoles

    @OneToMany(() => Post, (post) => post.user)
    post: Post[]

    @BeforeInsert() 
    async hashPassword() {
        this.password =await bcrypte.hash(this.password, 10)
    }
}
