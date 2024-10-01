import { EntityManager } from "typeorm";
import { User } from "src/user/user.entity";
import * as bcrypt from 'bcrypt'
import { faker } from "@faker-js/faker";



export const seedData = async (manager: EntityManager) => {
    await seedUser()



    async function seedUser() {
        const salt = await bcrypt.genSalt()
        const encryptedPassword = await bcrypt.hash("12345", salt)

        const user = new User()
        user.username = faker.internet.userName()
        user.email = faker.internet.email()
        user.password = encryptedPassword

        await manager.getRepository(User).save(user)
    }
}