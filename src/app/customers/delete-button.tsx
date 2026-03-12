"use client";

import { useTransition } from "react";
import { deleteCustomerAction } from "./actions";

export function DeleteCustomerButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (!confirm("确定删除这个客户？这一步会从本地数据里移除。")) return;
        const formData = new FormData();
        formData.set("id", id);
        startTransition(async () => {
          await deleteCustomerAction(formData);
          window.location.href = "/customers";
        });
      }}
      className="rounded-full border border-rose-200 px-4 py-2 text-sm text-rose-700 transition hover:bg-rose-50"
      disabled={pending}
    >
      {pending ? "删除中..." : "删除客户"}
    </button>
  );
}
