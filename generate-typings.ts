import { GraphQLDefinitionsFactory } from "@nestjs/graphql";
import { graphql } from "graphql";
import { join } from "path";


const definitionsFactory = new GraphQLDefinitionsFactory()
definitionsFactory.generate({
    typePaths: ['./**/*.graphql'],
    path: join(process.cwd(), 'src/graphql.ts'),
    outputAs: 'class'
})



export class Post {
    id: string
    title: string
}


export abstract class IQuery{
    abstract Posts():
        |Nullable<Nullable<Post>[]>
        |Promise<Nullable<Nullable<Post>[]>>
}


type Nullable<T> = T | null;