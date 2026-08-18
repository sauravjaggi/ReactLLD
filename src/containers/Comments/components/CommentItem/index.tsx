import { useState } from "react";
import { Comment } from "../../index";
import CommentInput from "../CommentInput";
import CommentList from "../CommentList";
import {
  FaRegHeart,
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaEdit,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import "./index.css";

interface CommentItemProps {
  comment: Comment;
  addComment: (comment: string, action: "Edit" | "Add", id?: string) => void;
  addLike: (id: string) => void;
  deleteComment: (id: string) => void;
}
const CommentItem = ({
  comment,
  addComment,
  addLike,
  deleteComment,
}: CommentItemProps) => {
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <div className="comment-item">
      <div className="comment-item-content">
        <p>{comment.user?.name}</p>
        {isEditing ? (
          <CommentInput
            addComment={addComment}
            placeholder="Edit Comment"
            id={comment.id}
            text={comment.text}
            action="Edit"
            callBack={() => {
              setIsEditing(false);
            }}
          />
        ) : (
          <p>{comment.text}</p>
        )}
        <p>
          <FaRegHeart />
          {comment.likes}
        </p>
        <button onClick={() => addLike(comment.id)}>
          {comment.isLiked ? <FaRegThumbsDown /> : <FaRegThumbsUp />}
        </button>
        {comment.user.id === "current-user" && (
          <>
            <button onClick={() => setIsEditing(true)}>
              <FaEdit />
            </button>
            <button onClick={() => deleteComment(comment.id)}>
              <MdDelete />
            </button>
          </>
        )}
      </div>
      <CommentInput
        addComment={addComment}
        placeholder="Add reply"
        id={comment.id}
        callBack={() => {
          setShowReplies(true);
        }}
      />
      {comment.replies.length > 0 && (
        <div className="comment-reply-content">
          <button onClick={() => setShowReplies(!showReplies)}>
            {showReplies ? "Hide Replies" : "Show Replies"}
          </button>
          {showReplies && (
            <CommentList
              comments={comment.replies}
              addComment={addComment}
              addLike={addLike}
              deleteComment={deleteComment}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
