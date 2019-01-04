import React from "react";

const Like = ({ liked, onLike }) => {
  let classes = "fa fa-heart";
  if (!liked) classes += "-o";
  return (
    <i
      className={classes}
      aria-hidden="true"
      style={{ cursor: "pointer" }}
      onClick={onLike}
    />
  );
};

export default Like;
