import * as argon2 from 'argon2';
import * as userRepository from '../repositories/user-repository';

type CreateOneArgs = {
    id: string;
    username: string;
    password: string;
};

export async function createOne({ id, username, password }: CreateOneArgs) {
    const existingUser = await userRepository.getOne({ user: { id } });

    if (existingUser) {
        return;
    }

    const passwordHash = await argon2.hash(password);

    return userRepository.insertOne({
        user: {
            id,
            username,
            passwordHash,
        },
    });
}

export async function updateOne({ id, username, password }: CreateOneArgs) {
    const existingUser = await userRepository.getOne({ user: { id } });

    if (!existingUser) {
        return;
    }

    const passwordHash = await argon2.hash(password);

    return userRepository.updateOne({
        user: {
            id,
            username,
            passwordHash,
        },
    });
}