import { ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import {
  formatTwinId,
  type AdminItem,
  type AdminItemSortOption,
} from '../../types/adminItem';

interface AdminItemTableProps {
  items: AdminItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string | null;
  isDeleting: boolean;
  deletingId: number | null;
  sort: AdminItemSortOption;
  onSortChange: (sort: AdminItemSortOption) => void;
  onEdit: (item: AdminItem) => void;
  onDelete: (item: AdminItem) => void;
}

const CATEGORY_COLOR: Record<AdminItem['category'], string> = {
  물류센터: '#38bdf8',
  제조센터: '#fbbf24',
};

const CARD_STYLE = {
  border: '1px solid rgba(0,212,255,0.1)',
  background: 'rgba(255,255,255,0.02)',
};

function SortHeader({
  label,
  ascValue,
  descValue,
  sort,
  onSortChange,
}: {
  label: string;
  ascValue: AdminItemSortOption;
  descValue: AdminItemSortOption;
  sort: AdminItemSortOption;
  onSortChange: (sort: AdminItemSortOption) => void;
}) {
  const isActive = sort === ascValue || sort === descValue;
  const isDesc = sort === descValue;
  const Icon = isDesc ? ChevronDown : ChevronUp;

  return (
    <button
      type="button"
      className="flex items-center gap-1 hover:text-white transition-colors"
      onClick={() => onSortChange(isDesc ? ascValue : descValue)}
    >
      {label}
      <Icon
        size={12}
        className={isActive ? 'text-[#00d4ff]' : 'text-white/20'}
      />
    </button>
  );
}

function AdminItemTable({
  items,
  isLoading,
  isError,
  errorMessage,
  isDeleting,
  deletingId,
  sort,
  onSortChange,
  onEdit,
  onDelete,
}: AdminItemTableProps) {
  if (isLoading) {
    return (
      <section
        className="rounded-2xl overflow-hidden"
        style={CARD_STYLE}
      >
        <p className="text-center py-16 text-white/30 text-sm">
          목록을 불러오는 중...
        </p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl overflow-hidden" style={CARD_STYLE}>
        <p className="text-center py-16 text-[#ff4466] text-sm">
          {errorMessage ?? '목록을 불러오지 못했습니다.'}
        </p>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="rounded-2xl overflow-hidden" style={CARD_STYLE}>
        <p className="text-center py-16 text-white/25 text-sm">
          검색 조건에 맞는 항목이 없습니다.
        </p>
      </section>
    );
  }

  return (
    <section
      className="rounded-2xl overflow-hidden font-['Rajdhani',sans-serif]"
      style={CARD_STYLE}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr
              style={{
                background: 'rgba(0,212,255,0.03)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <th className="text-left px-5 py-3 text-sm font-medium text-white/35 font-['JetBrains_Mono',monospace] w-[34%]">
                <SortHeader
                  label="트윈 이름"
                  ascValue="name-asc"
                  descValue="name-desc"
                  sort={sort}
                  onSortChange={onSortChange}
                />
              </th>
              <th className="text-left px-5 py-3 text-sm font-medium text-white/35 font-['JetBrains_Mono',monospace] w-[16%]">
                유형
              </th>
              <th className="text-left px-5 py-3 text-sm font-medium text-white/35 font-['JetBrains_Mono',monospace] w-[16%]">
                담당자
              </th>
              <th className="text-left px-5 py-3 text-sm font-medium text-white/35 font-['JetBrains_Mono',monospace] w-[18%]">
                <SortHeader
                  label="등록일자"
                  ascValue="oldest"
                  descValue="newest"
                  sort={sort}
                  onSortChange={onSortChange}
                />
              </th>
              <th className="text-left px-5 py-3 text-sm font-medium text-white/35 font-['JetBrains_Mono',monospace] w-[16%]">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-white/[0.03] transition-colors"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <td className="px-5 py-4">
                  <p className="font-semibold text-sm text-white">
                    {item.title}
                  </p>
                  <p className="text-white/30 text-xs font-['JetBrains_Mono',monospace] mt-0.5">
                    {formatTwinId(item.id)} · {item.location}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <span
                    className="text-sm px-2.5 py-1 rounded-lg whitespace-nowrap"
                    style={{
                      color: CATEGORY_COLOR[item.category],
                      background: `${CATEGORY_COLOR[item.category]}15`,
                      border: `1px solid ${CATEGORY_COLOR[item.category]}30`,
                    }}
                  >
                    {item.category}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-white/60 whitespace-nowrap">
                  {item.managerName}
                </td>
                <td className="px-5 py-4 text-sm text-white/40 font-['JetBrains_Mono',monospace] whitespace-nowrap">
                  {item.registeredAt}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white/30 transition-all hover:bg-[#00d4ff]/10 hover:text-[#00d4ff] disabled:opacity-40 disabled:cursor-not-allowed"
                      onClick={() => onEdit(item)}
                      disabled={isDeleting}
                      aria-label="수정"
                      title="수정"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> 수정
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white/30 transition-all hover:bg-[#ff4466]/10 hover:text-[#ff4466] disabled:opacity-40 disabled:cursor-not-allowed"
                      onClick={() => onDelete(item)}
                      disabled={isDeleting && deletingId === item.id}
                      aria-label="삭제"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> 삭제
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminItemTable;
