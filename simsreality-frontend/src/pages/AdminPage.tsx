import { Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminEditForm from '../components/admin/AdminEditForm';
import AdminModal from '../components/admin/AdminModal';
import AdminItemTable from '../components/admin/AdminItemTable';
import AdminPagination from '../components/admin/AdminPagination';
import AdminSearchForm from '../components/admin/AdminSearchForm';
import StatsCards from '../components/admin/StatsCards';
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
  CreateUploadProgress,
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
  const [editUploadProgress, setEditUploadProgress] =
    useState<CreateUploadProgress | null>(null);
  const [createSuccessMessage, setCreateSuccessMessage] = useState<
    string | null
  >(null);

  const { data: allItems = [] } = useAdminItems({});
  const { data = [], isLoading, isError } = useAdminItems(searchParams);
  const sortedItems = useMemo(
    () => sortAdminItems(data, sort),
    [data, sort],
  );

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE));

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedItems.slice(start, start + PAGE_SIZE);
  }, [sortedItems, currentPage]);

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
    searchParams,
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
    searchParams,
    onProgress: setEditUploadProgress,
    onSuccess: () => {
      setEditingItem(null);
    },
  });

  const deleteMutation = useDeleteAdminItem({
    searchParams,
    onSuccess: () => {
      setDeletingId(null);
    },
  });

  const handleCloseEditModal = useCallback(() => {
    if (!updateMutation.isPending) {
      setEditingItem(null);
      setEditUploadProgress(null);
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
    setEditUploadProgress(null);
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
          setEditUploadProgress(null);
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
    setEditUploadProgress(null);
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

      <StatsCards items={allItems} />

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
            uploadProgress={editUploadProgress}
            onSubmit={(input) => updateMutation.mutate(input)}
            onCancel={handleCloseEditModal}
          />
        </AdminModal>
      )}

      {createSuccessMessage && (
        <p className="admin-page__success twin-card">{createSuccessMessage}</p>
      )}

      {updateMutation.isError && (
        <p className="admin-page__error twin-card">
          수정에 실패했습니다. 다시 시도해주세요.
        </p>
      )}

      {deleteMutation.isError && (
        <p className="admin-page__error twin-card">
          삭제에 실패했습니다. 다시 시도해주세요.
        </p>
      )}

      <AdminItemTable
        items={paginatedItems}
        isLoading={isLoading}
        isError={isError}
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
