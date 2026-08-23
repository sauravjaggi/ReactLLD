// import { useState } from "react";
import { Comment } from "../../index";
import CommentItem from "../CommentItem";
import "./index.scss";

interface CommentListProps {
  comments: Comment[];
  addComment: (comment: string, action: "Edit" | "Add", id?: string) => void;
  addLike: (id: string) => void;
  deleteComment: (id: string) => void;
  depth?: number;
}

const CommentList = ({
  comments,
  addComment,
  addLike,
  deleteComment,
  depth = 0,
}: CommentListProps) => {
  return (
    <div className={`comment-list ${depth > 0 ? "comment-list--nested" : ""}`}>
      {comments.map((comment: Comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          addComment={addComment}
          addLike={addLike}
          deleteComment={deleteComment}
          depth={depth}
        />
      ))}
    </div>
  );
};

export default CommentList;
