import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // 1. Create a dummy Category
    const category = await prisma.category.upsert({
        where: { slug: 'cs-books' },
        update: {},
        create: {
            name: 'Computer Science Books',
            slug: 'cs-books',
        },
    })

    // 2. Create a dummy User (Seller)
    const seller = await prisma.user.upsert({
        where: { email: 'smitt@example.com' },
        update: {},
        create: {
            email: 'smitt@example.com',
            name: 'Smitt Patel',
        },
    })

    // 3. Create a dummy Product linked to the User and Category
    const product = await prisma.product.create({
        data: {
            title: 'Cracking the Coding Interview',
            description: 'Barely used, helped me get an internship!',
            price: 500,
            condition: 'LIKE_NEW',
            categoryId: category.id,
            sellerId: seller.id,
            images: {
                create: [
                    { url: 'https://via.placeholder.com/300', altText: 'Book Cover' }
                ]
            }
        },
    })

    console.log('Dummy data injected successfully! ')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })