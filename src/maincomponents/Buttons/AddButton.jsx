import { Button } from '@maincomponents/components/ui/button';
import { CirclePlus } from 'lucide-react';

const AddButton = ({ text, onClick }) => {
  return (
    <Button onClick={onClick} className="space-x-2">
      <CirclePlus size={18} />
      <span>{text}</span>
    </Button>
  );
};

export default AddButton;