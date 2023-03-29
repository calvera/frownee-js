import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeUpdate,
    BeforeInsert, BaseEntity
} from "typeorm"
import {v4} from 'uuid'

const bcrypt = require('bcrypt')

export enum UserRole {
    ADMIN = "admin",
    EDITOR = "editor",
    USER = "user",
}

@Entity()
export class User extends BaseEntity {

    @PrimaryColumn('uuid')
    id: string

    @Column({length: 64, unique: true})
    username: string

    @Column({length: 128, unique: true})
    email: string

    @Column("text", {nullable: true})
    password: string | null
    plainPassword: string | null

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole

    @Column()
    locked: boolean = false

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn({nullable: true})
    updatedAt: Date

    constructor() {
        super()

        this.id = v4();
    }

    @BeforeInsert()
    @BeforeUpdate()
    updatePassword(): void {
        if (this.plainPassword) {
            this.password = bcrypt.hashSync(this.plainPassword, 10)
        }
        this.plainPassword = null;
    }

    comparePassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password)
    }
}
