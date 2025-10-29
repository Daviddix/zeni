import React from "react";
import Link from "next/link";
import { useSetAtom } from "jotai";
import { showAddTransactionModalAtom } from "@/states/dashboard.states";

type singleNavLinkProps = {
  currentPath: string;
  href?: string;
  Icon: () => React.ReactElement;
  text: string;
};

function SingleNavLink({ currentPath, href, Icon, text }: singleNavLinkProps) {
    const setShowAddTransactionModal = useSetAtom(showAddTransactionModalAtom)

  const isActive = currentPath === href;

  const url = href ?? "";

  if (text === "Main Button") {
    return (
      <button
      onClick={()=>setShowAddTransactionModal(true)}
       className="primary-button">
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
