import { randomBytes, createHmac } from 'node:crypto'

import { db,eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user"
import { createUserWithEmailAndPasswordInput, createUserWithEmailAndPasswordInputType, generateUserTokenPayloadType, signInUserWithEmailAndPasswordInput, signInUserWithEmailAndPasswordInputType, generateUserTokenPayload
 } from "./model";
import * as JWT from 'jsonwebtoken'
import { env } from '../env'


class UserService {

    private async getUserByEmail(email: string) {
        const result = await db.select().from(usersTable).where(eq(usersTable.email, email))
        if(!result || result.length === 0) return null;
        return result[0];
    }

    private async generateHash (salt: string, password: string) {
        return createHmac('sha256', salt).update(password).digest('hex');
    }

    private async generateUserToken(payload: generateUserTokenPayloadType) {
        const {id} = await generateUserTokenPayload.parseAsync(payload)    
        const token = JWT.sign({id}, env.JWT_SECRET);
        return { token };
    }

    private async verifyUserToken(token: string): Promise<generateUserTokenPayloadType> {
        try {
            const verificationResult = JWT.verify(token, env.JWT_SECRET) as generateUserTokenPayloadType
            return verificationResult;
        } catch (error) {
            throw new Error('Invalid token')
        }
    }

    public async createUserWithEmailAndPassword(payload: createUserWithEmailAndPasswordInputType) {
        const {fullName, email, password } = await createUserWithEmailAndPasswordInput.parseAsync(payload)

        const existingUserWithEmail = await this.getUserByEmail(email);
        if(existingUserWithEmail) throw new Error(`User with email: ${email} already exists`);

        const salt = randomBytes(16).toString('hex');
        const hash = await this.generateHash(salt, password)
        const userInsertResult = await db.insert(usersTable).values({email, fullName, password:hash, salt}).returning({
            id: usersTable.id
        })
        
        if(!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id) throw new Error('Something went wrong while creating user')

        const userId = userInsertResult[0].id

        const { token } = await this.generateUserToken({id: userId})
        return {
            id: userId,
            token
        }
    }

    public async signInUserWithEmailAndPassword(payload: signInUserWithEmailAndPasswordInputType) {
        const {email, password} = await signInUserWithEmailAndPasswordInput.parseAsync(payload)

        const existingUser = await this.getUserByEmail(email)
        if(!existingUser) throw new Error(`User with email: ${email} does not exists`);
        if(!existingUser.password || !existingUser.salt) throw new Error('Invalid authentication method');

        const hash = await this.generateHash(existingUser.salt, password);
        
        if(hash !== existingUser.password) throw new Error('Invalid Email or password');
        
        const { token } = await this.generateUserToken({id: existingUser.id});
        
        return {
            id: existingUser.id,
            token
        }
    }

    public async verifyAndDecodeUserToken(token: string){
        const { id } = await this.verifyUserToken(token);
        return { id }
    }

    public async getUserInfoById(id: string){
        const user = await db.select({
            id: usersTable.id,
            fullName: usersTable.fullName,
            email: usersTable.email,
            profileImageUrl: usersTable.profileImageUrl
        }).from(usersTable).where(eq(usersTable.id, id))

        if(!user || user.length === 0) throw new Error(`User with id: ${id} does not exists`);

        return user[0]!;
    }
}

export default UserService;