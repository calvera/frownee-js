import {
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn
} from "typeorm"
import * as uuid from 'uuid'
import * as bcrypt from 'bcrypt'

export enum UserRole {
    ADMIN = "admin",
    EDITOR = "editor",
    USER = "user",
}

@Entity()
class User extends BaseEntity {

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

    @Column('boolean')
    locked = false

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn({nullable: true})
    updatedAt: Date

    constructor() {
        super()

        this.id = uuid.v4();
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

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            role: this.role,
            locked: this.locked,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        }
    }
}

export default User