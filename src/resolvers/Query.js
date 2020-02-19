import getUserId from '../utils/getUserId';

const Query = {
    users(root, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        };
        if (args.query) {
            opArgs.where = {
                OR: [
                    { name_contains: args.query },
                    { email_contains: args.query }
                ]
            };
        }
        return prisma.query.users(opArgs, info);
    },
    async me(root, args, { prisma, request }) {
        const userId = getUserId(request);
        return await prisma.query.user({
            where: {
                id: userId
            }
        });
    }
};

export { Query as default };
