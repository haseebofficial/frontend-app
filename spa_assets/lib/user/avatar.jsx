import "user/_styles/avatar.scss";
import React from "react";
import avatar from 'vendor/images/avatar.png';

export function AvatarCircle({src}) {
  return <img className="avatar-circle" src={src} alt="Avatar"/>;
}