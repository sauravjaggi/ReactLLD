import { useState } from "react";
import CommentInput from "./components/CommentInput";
import CommentList from "./components/CommentList";
import "./index.css";

export interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  likes: number;
  isLiked: boolean;
  replies: Comment[];
}

const mockComments: Comment[] = [
  {
    id: "1",
    user: {
      id: "u1",
      name: "Rahul",
      avatar: "avatar.jpg",
    },
    text: "Great video!",
    likes: 10,
    isLiked: false,
    replies: [
      {
        id: "2",
        user: {
          id: "u2",
          name: "Amit",
          avatar: "avatar2.jpg",
        },
        text: "Absolutely!",
        likes: 5,
        isLiked: false,
        replies: [],
      },
    ],
  },
];

const addReply = (
  comments: Comment[],
  id: string,
  newComment: Comment,
): Comment[] => {
  return comments.map((comment) => {
    if (comment.id === id) {
      return {
        ...comment,
        replies: [...comment.replies, newComment],
      };
    }
    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: addReply(comment.replies, id, newComment),
      };
    }
    return comment;
  });
};

const updateLike = (comments: Comment[], id: string): Comment[] => {
  return comments.map((comment: Comment) => {
    if (comment.id === id) {
      return {
        ...comment,
        likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        isLiked: !comment.isLiked,
      };
    }
    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateLike(comment.replies, id),
      };
    }
    return comment;
  });
};

const removeComment = (comments: Comment[], id: string): Comment[] => {
  return comments
    .filter((comment: Comment) => {
      return comment.id !== id;
    })
    .map((comment: Comment) => {
      if (comment.replies.length > 0) {
        return {
          ...comment,
          replies: removeComment(comment.replies, id),
        };
      }
      return comment;
    });
};

const editComment = (
  comments: Comment[],
  id: string,
  text: string,
): Comment[] => {
  return comments.map((comment: Comment) => {
    if (comment.id === id) {
      return {
        ...comment,
        text: text,
      };
    }
    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: editComment(comment.replies, id, text),
      };
    }
    return comment;
  });
};

const CommentContainer = () => {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const addComment = (text: string, action: "Edit" | "Add", id?: string) => {
    if (!text.trim()) {
      return;
    }

    const newComment: Comment = {
      id: crypto.randomUUID(),
      user: {
        id: "current-user",
        name: "Saurav",
        avatar: "avatar.jpg",
      },
      text: text,
      likes: 0,
      isLiked: false,
      replies: [],
    };
    if (!id) {
      setComments((prev) => [...prev, newComment]);
      return;
    }
    if (action === "Edit") {
      setComments((prev) => editComment(prev, id, text));
    } else {
      setComments((prev) => addReply(prev, id, newComment));
    }
  };

  const addLike = (id: string) => {
    setComments((prev) => updateLike(prev, id));
  };
  const deleteComment = (id: string) => {
    setComments((prev) => removeComment(prev, id));
  };

  return (
    <div className="comment-container">
      <CommentInput addComment={addComment} />
      <CommentList
        comments={comments}
        addComment={addComment}
        addLike={addLike}
        deleteComment={deleteComment}
      />
    </div>
  );
};

export default CommentContainer;
