// import { PrismaClient } from "@prisma/client"
// import { faker } from '@faker-js/faker'
// import * as bcrypt from 'bcrypt'


// const prisma = new PrismaClient()

// async function main() {

    
//     //create dummy users
//     const salt = await bcrypt.genSalt()
//     const password = faker.internet.password()
//     const encryptedPassword = await bcrypt.hash(password, salt)
//     const userOneEmail = faker.internet.email()

//     const userOne = await prisma.user.upsert({
//         where: {
//             email: userOneEmail
//         },
//         update: {},
//         create: {
//             username: faker.internet.userName(),
//             email: faker.internet.email(),
//             password: encryptedPassword
//         }
//     })

//     const passwordTwo = faker.internet.password()
//     const encryptedPasswordTwo = await bcrypt.hash(passwordTwo, salt)
//     const userTwoEmail = faker.internet.email()

//     const userTwo = await prisma.user.upsert({
//         where: {
//             email: userTwoEmail
//         },
//         update: {},
//         create: {
//             username: faker.internet.userName(),
//             email: faker.internet.email(),
//             password: encryptedPasswordTwo
//         }
//     })


//     //create dummy reviews
//     const reviewOne = await prisma.review.upsert({
//         where: {
//             id: faker.number.int({min: 1, max:1000}),
//         },
//         update: {},
//         create: {
//             title: faker.word.words(),
//             content: faker.lorem.paragraph(),
//             authorId: userOne.id,
//         }
//     })

//     const reviewTwo = await prisma.review.upsert({
//         where: {
//             id: faker.number.int({min: 1, max:1000}),
//         },
//         update: {},
//         create: {
//             title: faker.word.words(),
//             content: faker.lorem.paragraph(),
//             authorId: userTwo.id,
//         }
//     })




//     console.log(reviewOne, reviewTwo)
//     console.log(userOne, userTwo)
// }


// async function updateNullValues() {
//     await prisma.review.updateMany({
//         where: {
//             authorId: null
//         },
//         data: {
//             authorId: faker.number.int({min:1, max:8})
//         }
//     })
// }



// main()
// // updateNullValues()
//     .catch((e) => {
//         console.error(e)
//         process.exit(1)
//     })
//     .finally(async () => {
//         //close prisma client at the end
//         await prisma.$disconnect();
//     })