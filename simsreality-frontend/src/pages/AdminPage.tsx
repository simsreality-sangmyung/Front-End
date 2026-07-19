import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminEditForm from '../components/admin/AdminEditForm';
import AdminModal from '../components/admin/AdminModal';
import AdminItemTable from '../components/admin/AdminItemTable';
import AdminPagination from '../components/admin/AdminPagination';
import AdminSearchForm from '../components/admin/AdminSearchForm';
import TwinRegisterModal from '../components/twin/TwinRegisterModal';
import { useAdminItems } from '../hooks/useAdminItems';
import {
  useDeleteAdminItem,
  useUpdateAdminItem,
} from '../hooks/useAdminItemMutations';
import { useCreateAdminItem } from '../hooks/useCreateAdminItem';
import type {
  AdminItem,
  AdminItemSearchParams,
  AdminItemSortOption,
} from '../types/adminItem';
import { getApiErrorMessage } from '../utils/apiError';
import '../styles/twinDesignSystem.css';
import './AdminPage.css';

const PAGE_SIZE = 5;

function AdminPage() {
  const [searchParams, setSearchParams] = useState<AdminItemSearchParams>({});
  const [sort, setSort] = useState<AdminItemSortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState<AdminItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [createSuccessMessage, setCreateSuccessMessage] = useState<
    string | null
  >(null);

  const listParams = useMemo<AdminItemSearchParams>(
    () => ({
      ...searchParams,
      sort,
      page: currentPage - 1,
      size: PAGE_SIZE,
    }),
    [searchParams, sort, currentPage],
  );

  const {
    data: pageData,
    isLoading,
    isError,
    error: listError,
  } = useAdminItems(listParams);

  const totalPages = Math.max(1, pageData?.totalPages ?? 1);

  // 서버가 등록일(newest/oldest)·트윈 이름(name-asc/desc) 정렬을 처리하므로 그대로 사용합니다.
  const sortedItems = useMemo(() => pageData?.items ?? [], [pageData]);

  const listErrorMessage = isError
    ? getApiErrorMessage(listError, '목록을 불러오지 못했습니다.')
    : null;

  // 필터/검색 변경으로 totalPages가 줄어들어 currentPage가 범위를 벗어나는 경우를 보정합니다.
  // (기존 mock 버전에도 있던 패턴으로, 이 프로젝트에서 사전에 허용된 lint 경고입니다.)
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!createSuccessMessage) {
      return;
    }
    const timer = window.setTimeout(() => setCreateSuccessMessage(null), 3000);
    return () => window.clearTimeout(timer);
  }, [createSuccessMessage]);

  const handleSearch = useCallback((params: AdminItemSearchParams) => {
    setSearchParams(params);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((nextSort: AdminItemSortOption) => {
    setSort(nextSort);
    setCurrentPage(1);
  }, []);

  const createMutation = useCreateAdminItem({
    searchParams: listParams,
    onProgress: setUploadProgress,
    onSuccess: () => {
      setUploadProgress(null);
      setShowCreateForm(false);
      setCreateSuccessMessage('디지털트윈이 등록되었습니다.');
    },
  });

  const createErrorMessage = createMutation.isError
    ? getApiErrorMessage(createMutation.error, '디지털트윈 등록에 실패했습니다.')
    : null;

  const updateMutation = useUpdateAdminItem({
    searchParams: listParams,
    onSuccess: () => {
      setEditingItem(null);
    },
  });

  const updateErrorMessage = updateMutation.isError
    ? getApiErrorMessage(updateMutation.error, '수정에 실패했습니다.')
    : null;

  const deleteMutation = useDeleteAdminItem({
    searchParams: listParams,
    onSuccess: () => {
      setDeletingId(null);
    },
  });

  const deleteErrorMessage = deleteMutation.isError
    ? getApiErrorMessage(deleteMutation.error, '삭제에 실패했습니다.')
    : null;

  const handleCloseEditModal = useCallback(() => {
    if (!updateMutation.isPending) {
      setEditingItem(null);
    }
  }, [updateMutation.isPending]);

  const handleCreate = (input: Parameters<typeof createMutation.mutate>[0]) => {
    createMutation.mutate(input, {
      onError: () => {
        setUploadProgress(null);
      },
    });
  };

  const handleEdit = (item: AdminItem) => {
    setShowCreateForm(false);
    setUploadProgress(null);
    setEditingItem(item);
  };

  const handleDelete = (item: AdminItem) => {
    const confirmed = window.confirm(
      `"${item.title}" 항목을 삭제하시겠습니까?`,
    );
    if (!confirmed) {
      return;
    }

    setDeletingId(item.id);
    deleteMutation.mutate(item.id, {
      onSuccess: () => {
        if (editingItem?.id === item.id) {
          setEditingItem(null);
        }
      },
      onError: () => {
        setDeletingId(null);
      },
    });
  };

  const handleCloseCreateModal = useCallback(() => {
    if (!createMutation.isPending) {
      setShowCreateForm(false);
      setUploadProgress(null);
    }
  }, [createMutation.isPending]);

  const handleRegisterClick = () => {
    setEditingItem(null);
    setCreateSuccessMessage(null);
    setShowCreateForm(true);
  };

  return (
    <main className="min-h-screen overflow-auto p-8 bg-[#020b18] text-white font-['Rajdhani',sans-serif]">
      <header className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[#00d4ff] text-[10px] tracking-[0.2em] font-['JetBrains_Mono',monospace] mb-1">
            // TWIN MANAGEMENT
          </p>
          <h1 className="text-3xl font-bold tracking-wide">디지털트윈 관리</h1>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold tracking-wider text-sm text-[#020b18] transition-transform hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          style={{ background: '#00d4ff' }}
          onClick={handleRegisterClick}
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          <Plus size={16} strokeWidth={2.5} />
          트윈 등록
        </button>
      </header>

      <AdminSearchForm initialParams={searchParams} onSearch={handleSearch} />

      {showCreateForm && (
        <TwinRegisterModal
          isSubmitting={createMutation.isPending}
          uploadProgress={uploadProgress}
          submitError={createErrorMessage}
          onSubmit={handleCreate}
          onClose={handleCloseCreateModal}
        />
      )}

      {editingItem && (
        <AdminModal
          onClose={handleCloseEditModal}
          isCloseDisabled={updateMutation.isPending}
        >
          <AdminEditForm
            key={editingItem.id}
            item={editingItem}
            isSubmitting={updateMutation.isPending}
            onSubmit={(input) => updateMutation.mutate(input)}
            onCancel={handleCloseEditModal}
          />
        </AdminModal>
      )}

      {createSuccessMessage && (
        <p
          className="mb-4 px-4 py-3 rounded-xl text-sm text-[#00ff88]"
          style={{
            background: 'rgba(0,255,136,0.08)',
            border: '1px solid rgba(0,255,136,0.25)',
          }}
        >
          {createSuccessMessage}
        </p>
      )}

      {updateErrorMessage && (
        <p
          className="mb-4 px-4 py-3 rounded-xl text-sm text-[#ff4466]"
          style={{
            background: 'rgba(255,68,102,0.08)',
            border: '1px solid rgba(255,68,102,0.25)',
          }}
        >
          {updateErrorMessage}
        </p>
      )}

      {deleteErrorMessage && (
        <p
          className="mb-4 px-4 py-3 rounded-xl text-sm text-[#ff4466]"
          style={{
            background: 'rgba(255,68,102,0.08)',
            border: '1px solid rgba(255,68,102,0.25)',
          }}
        >
          {deleteErrorMessage}
        </p>
      )}

      <AdminItemTable
        items={sortedItems}
        isLoading={isLoading}
        isError={isError}
        errorMessage={listErrorMessage}
        isDeleting={deleteMutation.isPending}
        deletingId={deletingId}
        sort={sort}
        onSortChange={handleSortChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {!isLoading && !isError && sortedItems.length > 0 && (
        <p className="mt-4 text-white/20 text-xs font-['JetBrains_Mono',monospace]">
          전체 {pageData?.totalElements ?? sortedItems.length}개
        </p>
      )}

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}

export default AdminPage;
