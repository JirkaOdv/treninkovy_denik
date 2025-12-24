import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'jirka5522@gmail.com'; // Použijeme email jako login, pokud je to tak nastaveno
    const password = 'Juraj12552';
    const name = 'Jirka';

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'admin',
            },
        });
        console.log(`Created admin user: ${user.name} (${user.email})`);
    } else {
        // Update to admin just in case
        await prisma.user.update({
            where: { email },
            data: {
                role: 'admin',
                password: await bcrypt.hash(password, 10) // Resetuje heslo na vyžadované
            }
        });
        console.log(`Updated existing user ${name} to admin role and reset password.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
