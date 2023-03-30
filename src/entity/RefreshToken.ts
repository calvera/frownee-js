import {BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn} from "typeorm"
import User from './User'

@Entity()
class RefreshToken extends BaseEntity {

    @PrimaryColumn({length: 32})
    token: string

    @ManyToOne(() => User, {eager: true,})
    user: User

    @CreateDateColumn()
    createdAt: Date

    @Column()
    validUntil: Date
}

export default RefreshToken