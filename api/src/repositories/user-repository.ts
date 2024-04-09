import fs from 'fs';
import { User, UserRow } from '../entities';
import { DATABASE_PREFIX } from '../constants';

const TABLE_NAME = 'user';
let users: UserRow[] = [];

type InsertOneArgs = {
    user: User;
};

export async function insertOne({ user }: InsertOneArgs) {
    users.push(transform(user));
    await fs.promises.writeFile(
        `../${DATABASE_PREFIX}${TABLE_NAME}.json`,
        JSON.stringify(users, null, 2),
        {
            flag: 'w',
        },
    );

    return user;
}

type UpdateOneArgs = {
    user: User;
};

export async function updateOne({ user }: UpdateOneArgs) {
    users = JSON.parse(
        await fs.promises.readFile(`../${DATABASE_PREFIX}${TABLE_NAME}.json`, {
            encoding: 'utf-8',
        }),
    );

    let updatedUser;

    for (let i = 0; i < users.length; i++) {
        if (users[i].id === user.id) {
            updatedUser = user;
            users[i] = transform(updatedUser);
            break;
        }
    }

    await fs.promises.writeFile(
        `../${DATABASE_PREFIX}${TABLE_NAME}.json`,
        JSON.stringify(users, null, 2),
        {
            flag: 'w',
        },
    );

    return updatedUser;
}

type GetOneArgs = {
    user: Pick<User, 'id'>;
};

export async function getOne({ user }: GetOneArgs) {
    users = JSON.parse(
        await fs.promises.readFile(`../${DATABASE_PREFIX}${TABLE_NAME}.json`, {
            encoding: 'utf-8',
        }),
    );

    const result = users.find((userRow) => userRow.id === user.id);

    return result ? reverseTransform(result) : undefined;
}

function transform(user: User): UserRow {
    return {
        id: user.id,
        username: user.username,
        password_hash: user.passwordHash,
    };
}

function reverseTransform(raw: UserRow): User {
    return {
        id: raw.id,
        username: raw.username,
        passwordHash: raw.password_hash,
    };
}