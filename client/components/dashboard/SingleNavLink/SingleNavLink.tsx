import React from "react";
import Link from "next/link";

type singleNavLinkProps = {
  currentPath: string;
  href?: string;
  Icon: () => React.ReactElement;
  text: string;
};

function SingleNavLink({ currentPath, href, Icon, text }: singleNavLinkProps) {
  const isActive = currentPath === href;

  const url = href ?? "";

  if (text === "Main Button") {
    return (
      <button className="primary-button">
        <Icon />
      </button>
    );
  }

  return (
    <Link
      className={`dashboard-link ${isActive ? "active" : "inactive"}`}
      href={url}
    >
      <Icon />
      <p>{text}</p>
    </Link>
  );
}

export default SingleNavLink;
