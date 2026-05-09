import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type UpdateBlogProps = {
  isEditing: boolean;
  title: string;
  description: string;
  isUpdating: boolean;
  onStartEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
};

const UpdateBlog = ({
  isEditing,
  title,
  description,
  isUpdating,
  onStartEdit,
  onCancel,
  onSave,
  onTitleChange,
  onDescriptionChange,
}: UpdateBlogProps) => {
  if (!isEditing) {
    return (
      <Button type="button" size="sm" variant="outline" onClick={onStartEdit}>
        Update
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <Input value={title} onChange={(e) => onTitleChange(e.target.value)} className="h-10 bg-white" />
      <Textarea
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="min-h-[110px] bg-white"
      />
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" onClick={onSave} disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Save"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default UpdateBlog;
