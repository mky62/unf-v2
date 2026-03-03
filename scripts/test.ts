import { prisma } from '@/src/lib/prisma'


async  function test() {

    const user = await prisma.user.create({
        data: {
            id: 'test_user2',
            stageName: "testname2",
        username:   "testgithub2",    
        },
    })

    console.log("user2 inserted", user);

    const repo = await prisma.repo.create({
        data: {
            id: 1231,
            userId: user.id,
            name: "demo-repo2",
            url: "https://github.com/test/demo-repo2",
        },
    })

    console.log('Repo inserted', repo);
}

test()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });