import bcrypt from 'bcryptjs';
import prisma from '../../src/prisma';
import jwt from 'jsonwebtoken';

const userOne = {
    input: {
        name: 'Kate',
        email: 'kate@test.com',
        password: bcrypt.hashSync('test123$$$')
    },
    user: undefined,
    jwt: undefined
};

const userTwo = {
    input: {
        name: 'Jennifer',
        email: 'jennifer@test.com',
        password: bcrypt.hashSync('test123$$$')
    },
    user: undefined,
    jwt: undefined
};

const seedDatabase = async () => {
    jest.setTimeout(30000);
    await prisma.mutation.deleteManyUsers();

    userOne.user = await prisma.mutation.createUser({
        data: {
            ...userOne.input
        }
    });

    userTwo.user = await prisma.mutation.createUser({
        data: {
            ...userTwo.input
        }
    });

    userOne.jwt = await jwt.sign(
        { userId: userOne.user.id },
        process.env.JWT_SECRET
    );

    userTwo.jwt = await jwt.sign(
        { userId: userTwo.user.id },
        process.env.JWT_SECRET
    );
};

export { seedDatabase as default, userOne, userTwo };
