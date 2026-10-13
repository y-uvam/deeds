import { gql } from '@apollo/client';

export const GET_FEED = gql`
  query GetFeed($limit: Int, $cursor: String) {
    feed(limit: $limit, cursor: $cursor) {
      edges {
        _id
        caption
        mediaUrls
        aspectRatio
        likesCount
        commentsCount
        isLiked
        isBookmarked
        createdAt
        author {
          _id
          name
          username
          avatarUrl
          isVerified
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    post(id: $id) {
      _id
      caption
      mediaUrls
      aspectRatio
      likesCount
      commentsCount
      isLiked
      isBookmarked
      createdAt
      author {
        _id
        name
        username
        avatarUrl
        isVerified
      }
    }
  }
`;

export const GET_POST_COMMENTS = gql`
  query GetPostComments($postId: ID!, $limit: Int, $cursor: String) {
    comments(postId: $postId, limit: $limit, cursor: $cursor) {
      edges {
        _id
        postId
        text
        likesCount
        isLiked
        createdAt
        author {
          _id
          name
          username
          avatarUrl
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: ID!) {
    user(id: $userId) {
      _id
      name
      username
      avatarUrl
      bio
      isVerified
      followersCount
      followingCount
      postsCount
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      _id
      likesCount
      isLiked
    }
  }
`;

export const UNLIKE_POST = gql`
  mutation UnlikePost($postId: ID!) {
    unlikePost(postId: $postId) {
      _id
      likesCount
      isLiked
    }
  }
`;

export const BOOKMARK_POST = gql`
  mutation BookmarkPost($postId: ID!) {
    bookmarkPost(postId: $postId) {
      _id
      isBookmarked
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($caption: String, $mediaUrls: [String!]!, $aspectRatio: Float) {
    createPost(input: { caption: $caption, mediaUrls: $mediaUrls, aspectRatio: $aspectRatio }) {
      _id
      caption
      mediaUrls
      aspectRatio
      likesCount
      commentsCount
      isLiked
      isBookmarked
      createdAt
      author {
        _id
        name
        username
        avatarUrl
      }
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation AddComment($postId: ID!, $text: String!) {
    addComment(postId: $postId, text: $text) {
      _id
      postId
      text
      likesCount
      isLiked
      createdAt
      author {
        _id
        name
        username
        avatarUrl
      }
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(commentId: $commentId) {
      _id
      success
    }
  }
`;
