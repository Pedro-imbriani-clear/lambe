import React, { createContext, useState } from "react"
import axios from 'axios'
import useEvent from '../hooks/useEvent'

const FeedContext = createContext({})

export const FeedProvider = ({ children }) => {
    const [posts, setPosts] = useState([])
    const { startingUpload, finishedUpload } = useEvent()

    const feedInternalContext = {
        posts,
        fetchPosts: async function() {
            try {
                const res = await axios.get('/posts.json')
                const rawPosts = res.data
                const postsTemp = []
                for(let key in rawPosts) {
                    postsTemp.push({
                        ...rawPosts[key],
                        id: key
                    })
                }
                setPosts(postsTemp)
            } catch(err) {
                console.log(err)
            }
        },
        addPost: async function(post) {
            try {
                startingUpload()
                const resStorage = await axios({
                    url: 'uploadImage',
                    baseURL: 'https://us-central1-instaclone-b78e8.cloudfunctions.net',
                    method: 'post',
                    data: {
                        image: post.image.base64
                    }
                })
                post.image = resStorage.data.imageUrl
                await axios.post('/posts.json', post)
                finishedUpload()
                feedInternalContext.fetchPosts()
            } catch(err) {
                console.log(err)
            }
        },
        addComment: function(postId, comment) {
            const postsTemp = posts.map(post => {
                if(post.id === postId) {
                    if(!post.comments) {
                        post.comments = []
                    } 
                    post.comments = post.comments.concat( comment )
                }
                return post
            })
            setPosts(postsTemp)
        }
    }

    return (
        <FeedContext.Provider value={feedInternalContext}>
            {children}
        </FeedContext.Provider>
    )
}

export default FeedContext