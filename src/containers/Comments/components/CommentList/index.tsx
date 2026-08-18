// import { useState } from "react";
import { Comment } from "../../index";
import CommentItem from "../CommentItem";
interface CommentListProps {
  comments: Comment[];
  addComment: (comment: string, action: "Edit" | "Add", id?: string) => void;
  addLike: (id: string) => void;
  deleteComment: (id: string) => void;
}

const CommentList = ({
  comments,
  addComment,
  addLike,
  deleteComment,
}: CommentListProps) => {
  return (
    <div className="comment-list">
      {comments.map((comment: Comment) => {
        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            addComment={addComment}
            addLike={addLike}
            deleteComment={deleteComment}
          />
        );
      })}
    </div>
  );
};

export default CommentList;
