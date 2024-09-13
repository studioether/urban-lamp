import { Query, Resolver, Mutation} from "@nestjs/graphql";
import { DeleteResult, Post, UpdateResult } from "src/graphql";
import { PostService } from "./post.service";
import { Args } from "@nestjs/graphql";
import { CreatePostDto } from "./dto/createpost.dto.ts"
import { UpdatePostDto } from "./dto/updatepost.dto.ts"
import { GraphQLError } from "graphql";


@Resolver()
export class PostResolver{
    constructor(private readonly postService: PostService){}

    @Query('posts')
    async getPosts(): Promise<Post[]> {
        try {
            return this.postService.getPosts()
        } catch (err) {
            console.error(err)
            throw new GraphQLError('unable to fetch posts', {
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    }

    @Query("post")
    async getPost(@Args('id') id:string): Promise<Post> {
        return this.postService.getPost(id)
    }

    @Mutation("createPost")
    async createPost(@Args("createPostInput") args:CreatePostDto): Promise<Post> {
        return this.postService.createPost(args)
    }

    @Mutation("updatePost")
    async updatePost(@Args("updatePostInput") args:UpdatePostDto, @Args("id") id: string): Promise<UpdateResult> {
        return this.postService.updatePost(id, args)
    }

    @Mutation("deletePost")
    async deletePost(@Args("id") id:string): Promise<DeleteResult> {
        return this.postService.deletePost(id)
    }

}