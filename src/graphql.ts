
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class Post {
    id: string;
    title: string;
}

export abstract class IQuery {
    abstract posts(): Post[] | Promise<Post[]>;

    abstract post(id: string): Post | Promise<Post>;
}

export abstract class IMutation {
    abstract createPost(title: string): Post | Promise<Post>;

    abstract updatePost(id: string, updatePostInput: UpdatePostInput): UpdateResult | Promise<UpdateResult>;

    abstract deletePost(id: string): DeleteResult | Promise<DeleteResult>;
}

export class UpdatePostInput {
    title?: Nullable<string>;
}

export class UpdateResult {
    affected: number;
}

export class DeleteResult {
    affected: number;
}

type Nullable<T> = T | null;
