import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import CommunityLayout from '@/components/CommunityLayout';
import PostCard from '@/components/PostCard';
import ConnectionSuggestion from '@/components/ConnectionSuggestion';
import ConnectionRequestModal from '@/components/ConnectionRequestModal';
import { Loader2, Image as ImageIcon } from 'lucide-react';

export default function CommunityFeed() {
  const [, setLocation] = useLocation();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [postContent, setPostContent] = useState('');
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [selectedUserForConnection, setSelectedUserForConnection] = useState<{ id: string; name: string } | null>(null);

  const { data: postsData, isLoading: isLoadingPosts, refetch: refetchPosts } = trpc.community.posts.list.useQuery({
    limit: 20,
    offset: 0,
  });

  useEffect(() => {
    const user = localStorage.getItem('communityUser');
    const userId = localStorage.getItem('communityUserId');

    if (!user || !userId) {
      setLocation('/community/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      setUserProfile(parsedUser);
    } catch (error) {
      setLocation('/community/login');
    } finally {
      setIsLoadingUser(false);
    }
  }, [setLocation]);

  const createPostMutation = trpc.community.posts.create.useMutation();

  const handleConnectionRequest = (userId: string, userName: string) => {
    setSelectedUserForConnection({ id: userId, name: userName });
    setShowConnectionModal(true);
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() || !userProfile) return;

    try {
      const result = await createPostMutation.mutateAsync({
        userId: userProfile.id,
        content: postContent,
      });

      if (result.success) {
        setPostContent('');
        refetchPosts();
      }
    } catch (error) {
      console.error('Erro ao criar postagem:', error);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  return (
    <CommunityLayout
      userProfile={userProfile}
      rightSidebar={
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Sugestões de Conexão</h3>
          <div className="space-y-4">
            {/* Mock suggestions - será substituído por dados reais */}
            <ConnectionSuggestion
              id="1"
              name="Ana Silva"
              mainArea="Tecnologia"
              experienceYears={5}
              state="SP"
              commonInterests={['Tecnologia', 'Primeiro Emprego']}
              onConnect={() => alert('Solicitação enviada!')}
            />
            <ConnectionSuggestion
              id="2"
              name="Carlos Santos"
              mainArea="Administrativa & RH"
              experienceYears={8}
              state="RJ"
              commonInterests={['Administrativa & RH']}
              onConnect={() => alert('Solicitação enviada!')}
            />
          </div>
        </div>
      }
    >
      {/* Create Post */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-4">
          {userProfile.profilePhotoUrl ? (
            <img
              src={userProfile.profilePhotoUrl}
              alt={userProfile.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
              {userProfile.fullName.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="O que você está pensando?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
              rows={3}
            />
            <div className="flex items-center justify-between mt-3">
              <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition">
                <ImageIcon className="w-5 h-5" />
                <span className="text-sm font-semibold">Foto</span>
              </button>
              <button
                onClick={handleCreatePost}
                disabled={!postContent.trim() || createPostMutation.isPending}
                className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {createPostMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Postar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      {isLoadingPosts ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      ) : postsData?.data && postsData.data.length > 0 ? (
        postsData.data.map((post: any) => (
          <PostCard
            key={post.id}
            id={post.id}
            author={{
              id: post.userId,
              name: post.author?.fullName || 'Usuário',
              avatar: post.author?.profilePhotoUrl,
              mainArea: post.author?.mainArea || 'Profissional',
            }}
            content={post.content}
            imageUrl={post.imageUrl}
            likes={post.likes}
            comments={post.comments}
            shares={post.shares}
            createdAt={new Date(post.createdAt)}
            onLike={() => alert('Curtida registrada!')}
            onComment={() => alert('Comentários em breve!')}
            onShare={() => alert('Compartilhamento em breve!')}
            onReport={() => alert('Denúncia registrada!')}
            onConnectionRequest={handleConnectionRequest}
          />
        ))
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600 mb-4">Nenhuma postagem ainda</p>
          <p className="text-sm text-gray-500">Seja o primeiro a postar algo!</p>
        </div>
      )}

      {/* Connection Modal */}
      {selectedUserForConnection && (
        <ConnectionRequestModal
          isOpen={showConnectionModal}
          onClose={() => {
            setShowConnectionModal(false);
            setSelectedUserForConnection(null);
          }}
          targetUserId={selectedUserForConnection.id}
          targetUserName={selectedUserForConnection.name}
        />
      )}
    </CommunityLayout>
  );
}
