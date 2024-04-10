import * as argon2 from 'argon2';
import * as userRepository from '../repositories/user-repository';
import { ERR_ENTITY_ALREADY_EXIST, ERR_ENTITY_NOT_FOUND } from '../errors';

type CreateOneArgs = {
    id: string;
    username: string;
    password: string;
};

export async function createOne({ id, username, password }: CreateOneArgs) {
    const existingUser = await userRepository.getOne({ user: { id } });

    if (existingUser) {
        throw new ERR_ENTITY_ALREADY_EXIST()
            .withContextualData({ user: { id, username, password } })
            .withPublicMessage(
                'Account already exist. If you forgot your password ou can reset it',
            );
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
        throw new ERR_ENTITY_NOT_FOUND()
            .withContextualData({ user: { id, username, password } })
            .withPublicMessage('User not found');
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
