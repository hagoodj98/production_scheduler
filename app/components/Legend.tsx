import { STATUSES, STATUS_COLORS } from '../../utils/GlobalVar';

const Legend = () => {
  return (
    <div>
      <div className="flex flex-wrap gap-3 mt-2">
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`w-3 h-3 rounded-sm `}
            style={{ background: STATUS_COLORS[STATUSES.search_add] }}
          />{' '}
          <span>Search/Add</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span
            className="w-3 h-3 rounded-sm bg-"
            style={{ background: STATUS_COLORS[STATUSES.pending] }}
          />{' '}
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ background: STATUS_COLORS[STATUSES.scheduled] }}
          />{' '}
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ background: STATUS_COLORS[STATUSES.busy] }}
          />{' '}
          <span>Busy</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ background: STATUS_COLORS[STATUSES.completed] }}
          />{' '}
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span
            className="w-3 h-3 rounded-sm"
            style={{ background: STATUS_COLORS[STATUSES.deleted] }}
          />{' '}
          <span>Deleted</span>
        </div>
      </div>
    </div>
  );
};

export default Legend;
