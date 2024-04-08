import * as argon2 from 'argon2';
import * as userRepository from '../repositories/user-repository';

type CreateOneArgs = {
    id: string;
    username: string;
    password: string;
};

export async function createOne({ id, username, password }: CreateOneArgs) {
    const passwordHash = await argon2.hash(password);

    await userRepository.insertOne({
        user: {
            id,
            username,
            passwordHash,
        },
    });
}
