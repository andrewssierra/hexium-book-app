import bcrypt from 'bcryptjs';
import getUserId from '../utils/getUserId';
import getWebToken from '../utils/generateToken';
import hashPassword from '../utils/hashPassword';

const Mutation = {
    async createUser(root, args, { prisma }, info) {
        const password = await hashPassword(args.data.password);
        const emailUsed = await prisma.exists.User({ email: args.data.email });
        if (emailUsed) {
            throw new Error('Email is already being used');
        }
        const user = prisma.mutation.createUser({
            data: { ...args.data, password }
        });
        return {
            user,
            token: getWebToken(user.id)
        };
    },
    async login(root, args, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        });
        if (!user.email) {
            throw new Error('Unable to login');
        }
        const isMatch = await bcrypt.compare(args.data.password, user.password);
        if (isMatch) {
            return {
                user,
                token: getWebToken(user.id)
            };
        } else {
            throw new Error('Unable to login');
        }
    },
    async deleteUser(root, args, { prisma, request }, info) {
        const userId = getUserId(request);
        const exists = await prisma.exists.User({ id: userId });
        if (exists === -1) {
            throw new Error('User not found');
        }
        return prisma.mutation.deleteUser({ where: { id: userId } }, info);
    },
    async updateUser(root, args, { prisma, request }, info) {
        const userId = getUserId(request);
        if (typeof args.data.password === 'string') {
            args.data.password = await hashPassword(args.data.password);
        }
        return prisma.mutation.updateUser(
            {
                where: { id: userId },
                data: { name: args.data.name, email: args.data.email }
            },
            info
        );
    }
};

export { Mutation as default };
