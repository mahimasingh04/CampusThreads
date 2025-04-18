
import { Button } from '@/components/ui/button';
import { useSetRecoilState } from 'recoil';
import { communityModalState } from '@/atoms/communityAtoms';
import { Plus } from 'lucide-react';

export default function CreateCommunityButton() {
  const setIsOpen = useSetRecoilState(communityModalState);

  return (
    <Button 
      onClick={() => setIsOpen(true)}
      className="flex items-center space-x-2"
    >
      <Plus className="h-4 w-4" />
      <span>Create Community</span>
    </Button>
  );
}