import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state";
import { serverUrl } from "../../config";

import { TextField } from "@mui/material";
import { Button } from "@mui/material";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  onDelete,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(comments);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`${serverUrl}/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  useEffect(() => {
    // Fetch comments from the backend when the component mounts
    // or when the user toggles the comments view.
    const fetchComments = async () => {
      if (isComments) {
        const response = await fetch(`${serverUrl}/posts/${postId}/comments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCommentsList(data);
      }
    };

    fetchComments();
  }, [isComments, postId, token]);

  const postComment = async () => {
    // Post the comment to the backend
    const response = await fetch(`${serverUrl}/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: commentText }),
    });
    if (response.ok) {
      const newComment = await response.json();

      // Update the comments list with the new comment
      setCommentsList([...commentsList, newComment]);
      setCommentText(""); // Clear the comment input field
    }
  };

  // Function to delete a comment
  const deleteComment = async (commentId) => {
    console.log("Token being sent with request:", token);
    const response = await fetch(
      `${serverUrl}/posts/${postId}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      // Filter out the deleted comment from the comments list
      setCommentsList(
        commentsList.filter((comment) => comment._id !== commentId)
      );
    } else {
      console.error(
        "Failed to delete comment:",
        response.status,
        await response.text()
      );
    }
  };

  const deletePost = async () => {
    const response = await fetch(`${serverUrl}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      // Call the onDelete prop to notify the parent component
      onDelete(postId);
      console.log("Post deleted successfully");
    } else {
      console.error(
        "Failed to delete post:",
        response.status,
        await response.text()
      );
    }
};

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`${serverUrl}/assets/${picturePath}`}
        />
      )}

      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          {/* COMMENT SECTION*/}

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
        <FlexBetween>
          <IconButton>
            <ShareOutlined />
          </IconButton>
          {postUserId === loggedInUserId && (
            <IconButton onClick={deletePost}>
              <DeleteOutlineOutlined />
            </IconButton>
          )}
        </FlexBetween>
      </FlexBetween>

      {isComments && (
        <Box mt="0.5rem">
          {commentsList.map((comment, i) => (
            <Box key={`${comment._id}-${i}`} sx={{ position: "relative" }}>
              <Divider />
              <Box display="flex" alignItems="center" p="0.5rem">
                {comment.creator && (
                  <Box mr="1rem">
                    {/* Display the comment creator's picture */}
                    <img
                      src={`${serverUrl}/assets/${comment.creator.picturePath}`}
                      alt={`${comment.creator.firstName}'s profile`}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                )}
                <Box flexGrow={1}>
                  {/* Display the comment creator's name */}
                  {comment.creator && (
                    <Typography variant="subtitle2" color="textPrimary">
                      {comment.creator.firstName}
                    </Typography>
                  )}
                  <Typography sx={{ color: main }}>
                    {comment.text} {/* Display the comment text */}
                  </Typography>
                </Box>
                {/* Delete button (only shown to the comment creator) */}
                {comment.creator && comment.creator._id === loggedInUserId && (
                  <IconButton
                    sx={{ position: "absolute", right: "10px" }}
                    size="small"
                    onClick={() => deleteComment(comment._id)}
                  >
                    <DeleteOutlineOutlined />
                  </IconButton>
                )}
              </Box>
            </Box>
          ))}
          <Divider />
          {/* Comment submission form */}
          <Box display="flex" alignItems="center" mt="0.5rem">
            <TextField
              fullWidth
              size="small"
              label="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              variant="outlined"
            />
            <Button onClick={postComment} variant="contained" sx={{ ml: 1 }}>
              Post
            </Button>
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
