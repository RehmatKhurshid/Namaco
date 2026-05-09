import { useState } from "react";
import { Button } from "../ui/button";

type DeleteBlogProps = {
  isDeleting: boolean;
  onDelete: () => void;
};

const DeleteBlog = ({ isDeleting, onDelete }: DeleteBlogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirmDelete = () => {
    onDelete();
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="destructive"
        onClick={() => setIsDialogOpen(true)}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete Blog</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete this blog? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteBlog;
