import { Static, Type } from '@sinclair/typebox';

export const UserSchema = Type.Object({
    id: Type.String(),
    username: Type.String(),
    passwordHash: Type.String(),
});

export type User = Static<typeof UserSchema>;
