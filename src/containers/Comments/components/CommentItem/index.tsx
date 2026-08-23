import { useState } from "react";
import { Typography, Collapse, Button } from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { Comment } from "../../index";
import CommentInput from "../CommentInput";
import CommentList from "../CommentList";
import UserAvatar from "../../../../components/UserAvatar";
import IconActionButton from "../../../../components/IconActionButton";
import "./index.scss";

interface CommentItemProps {
  comment: Comment;
  addComment: (comment: string, action: "Edit" | "Add", id?: string) => void;
  addLike: (id: string) => void;
  deleteComment: (id: string) => void;
  depth?: number;
}
const CommentItem = ({
  comment,
  addComment,
  addLike,
  deleteComment,
  depth = 0,
}: CommentItemProps) => {
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const hasReplies = comment.replies.length > 0;
  const authorName = comment.user?.name || "Unknown user";

  return (
    <div className={`comment-item ${depth > 0 ? "comment-item--reply" : ""}`}>
      <UserAvatar
        name={authorName}
        src={comment.user?.avatar}
        size={depth > 0 ? 30 : 36}
      />

      <div className="comment-item__body">
        <div className="comment-item__bubble">
          <Typography variant="subtitle2" className="comment-item__name">
            {authorName}
          </Typography>

          {isEditing ? (
            <CommentInput
              addComment={addComment}
              placeholder="Edit comment"
              id={comment.id}
              text={comment.text}
              action="Edit"
              callBack={() => setIsEditing(false)}
            />
          ) : (
            <Typography variant="body2" className="comment-item__text">
              {comment.text}
            </Typography>
          )}
        </div>

        {!isEditing && (
          <div className="comment-item__actions">
            <IconActionButton
              icon={
                comment.isLiked ? (
                  <ThumbUpIcon fontSize="small" />
                ) : (
                  <ThumbUpOutlinedIcon fontSize="small" />
                )
              }
              label={comment.likes}
              active={comment.isLiked}
              onClick={() => addLike(comment.id)}
              ariaLabel={comment.isLiked ? "Unlike comment" : "Like comment"}
              tooltip={comment.isLiked ? "Unlike" : "Like"}
            />

            <button
              type="button"
              className="comment-item__text-action"
              onClick={() => setShowReplyInput((v) => !v)}
            >
              Reply
            </button>

            {comment.user.id === "current-user" && (
              <>
                <IconActionButton
                  icon={<EditOutlinedIcon fontSize="small" />}
                  onClick={() => setIsEditing(true)}
                  ariaLabel="Edit comment"
                  tooltip="Edit"
                />
                <IconActionButton
                  icon={<DeleteOutlineIcon fontSize="small" />}
                  onClick={() => deleteComment(comment.id)}
                  ariaLabel="Delete comment"
                  tooltip="Delete"
                  color="error"
                />
              </>
            )}
          </div>
        )}

        {showReplyInput && (
          <div className="comment-item__reply-input">
            <CommentInput
              addComment={addComment}
              placeholder="Add a reply"
              id={comment.id}
              callBack={() => {
                setShowReplyInput(false);
                setShowReplies(true);
              }}
            />
          </div>
        )}

        {hasReplies && (
          <>
            <Button
              className={`comment-item__toggle-replies ${showReplies ? "is-open" : ""}`}
              onClick={() => setShowReplies((v) => !v)}
              endIcon={<ExpandMoreRoundedIcon />}
              size="small"
              disableRipple
            >
              {showReplies
                ? "Hide replies"
                : `${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`}
            </Button>

            <Collapse in={showReplies} timeout={200} unmountOnExit>
              <CommentList
                comments={comment.replies}
                addComment={addComment}
                addLike={addLike}
                deleteComment={deleteComment}
                depth={depth + 1}
              />
            </Collapse>
          </>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
