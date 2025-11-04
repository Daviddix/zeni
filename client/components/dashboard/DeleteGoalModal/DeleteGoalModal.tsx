import Image from "next/image"
import "./DeleteGoalModal.css"
import deleteIcon from "@/public/images/delete-modal-icon.svg"
import { useState } from "react"

type DeleteGoalModalProps = {
  goalId: string;
  goalName: string;
  onCancel: () => void;
  onDeleteSuccess: () => void;
}

function DeleteGoalModal({ goalId, goalName, onCancel, onDeleteSuccess }: DeleteGoalModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/goals/goal/${goalId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete goal");
      }

      console.log("Goal deleted successfully:", data);
      onDeleteSuccess();
    } catch (err) {
      console.error("Error deleting goal:", err);
      setError(err instanceof Error ? err.message : "Failed to delete goal");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="modal-bg">
        <div className="delete-goal-modal">
            <header>
                <Image 
                src={deleteIcon}
                alt="delete icon"
                />

                <h2>Delete Budget Goal</h2>
            </header>

            <p>Are you sure you want to delete <strong>&quot;{goalName}&quot;</strong>? This action cannot be reversed</p>

            {error && <p className="error-message" style={{ color: 'red', fontSize: '14px' }}>{error}</p>}

            <div className="actions">
                <button 
                  onClick={onCancel}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button 
                  className="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    </div>
  )
}

export default DeleteGoalModal