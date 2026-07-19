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
import { sortAdminItems } from '../utils/sortAdminItems';
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

  const items = useMemo(() => pageData?.items ?? [], [pageData]);
  // 서버가 등록일 기준(newest/oldest)으로만 응답을 정렬해주므로, 같은 기준으로 클라이언트
  // 에서도 한 번 더 정렬해 정확도를 보장합니다.
  const sortedItems = useMemo(() => sortAdminItems(items, sort), [items, sort]);

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
    <main className="admin-page">
      <header className="admin-page__header">
        <div>
          <p className="admin-page__eyebrow">// TWIN MANAGEMENT</p>
          <h1>디지털트윈 관리</h1>
        </div>
        <button
          type="button"
          className="twin-btn twin-btn--primary admin-page__register-btn"
          onClick={handleRegisterClick}
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          <Plus size={14} strokeWidth={2.5} />
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
        <p className="admin-page__success twin-card">{createSuccessMessage}</p>
      )}

      {updateErrorMessage && (
        <p className="admin-page__error twin-card">{updateErrorMessage}</p>
      )}

      {deleteErrorMessage && (
        <p className="admin-page__error twin-card">{deleteErrorMessage}</p>
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

      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}

export default AdminPage;
