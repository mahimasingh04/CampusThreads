
import { RecoilRoot } from 'recoil';
import CreateCommunityButton from '@/components/CreateCommunityButton'
import CreateCommunityModal from '@/components/Modal/CreateCommunity';

const CommunityPage = () => {
  return (
    <RecoilRoot>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-end mb-6">
            <CreateCommunityButton />
          </div>
          <CreateCommunityModal />
        </div>
      </div>
    </RecoilRoot>
  );
};

export default CommunityPage;
