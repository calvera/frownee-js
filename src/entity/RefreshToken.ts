import {Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, BaseEntity} from "typeorm"
import {User} from './User'

@Entity()
export class RefreshToken extends BaseEntity {

    @PrimaryColumn({length: 32})
    token: string

    @ManyToOne(() => User, {eager: true,})
    user: User

    @CreateDateColumn()
    createdAt: Date

    @Column()
    validUntil: Date
}
